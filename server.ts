import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import {
  exchangeAuthorizationCode,
  refreshAccessToken,
  verifyBazaarPurchase,
  getBazaarAuthStatus,
  getBazaarAuthorizeUrl,
  DEFAULT_BAZAAR_REDIRECT_URI,
} from "./server/bazaarService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Generative AI client lazily
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    genAiClient = new GoogleGenAI({ apiKey });
  }
  return genAiClient;
}

// ==========================================
// Gemini AI Generation API Route
// ==========================================
app.post("/api/generate", async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAi();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    return res.json({ text });
  } catch (error: any) {
    console.error("[Gemini API Error]", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI content.",
    });
  }
});

// ==========================================
// Cafe Bazaar OAuth & Verification API Routes
// ==========================================

/**
 * Returns current status of Cafe Bazaar OAuth configuration on server.
 */
app.get("/api/bazaar/status", (req: Request, res: Response) => {
  try {
    const status = getBazaarAuthStatus();
    return res.json(status);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Returns the authorization URL for Cafe Bazaar OAuth 2.0.
 */
app.get("/api/bazaar/authorize-url", (req: Request, res: Response) => {
  try {
    const requestedRedirect = typeof req.query.redirect_uri === "string" ? req.query.redirect_uri : undefined;
    const url = getBazaarAuthorizeUrl(requestedRedirect);
    return res.json({ url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Exchanges the Authorization Code received from Cafe Bazaar for access & refresh tokens.
 */
app.post("/api/bazaar/exchange", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: "Missing authorization code",
        error_description: "Please provide a valid code parameter in JSON body.",
      });
    }

    const result = await exchangeAuthorizationCode(code.trim());
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
      error_description: err.message || "Internal server error during token exchange.",
    });
  }
});

/**
 * Direct OAuth Callback handler in case Cafe Bazaar redirects here directly.
 */
app.get("/api/bazaar/callback", (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (code && typeof code === "string") {
    return res.redirect(`/?code=${encodeURIComponent(code)}#vip`);
  }
  return res.redirect(`/?error=${encodeURIComponent(String(error || "oauth_failed"))}#vip`);
});

/**
 * Refreshes the access token using the stored refresh token.
 */
app.post("/api/bazaar/refresh", async (req: Request, res: Response) => {
  try {
    const result = await refreshAccessToken();
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
      error_description: err.message || "Internal server error during token refresh.",
    });
  }
});

/**
 * Cryptographically verifies an in-app purchase or subscription token with Cafe Bazaar.
 */
app.post("/api/bazaar/verify", async (req: Request, res: Response) => {
  try {
    const { packageName, sku, purchaseToken } = req.body;
    if (!purchaseToken) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "purchaseToken is required",
      });
    }

    const verificationResult = await verifyBazaarPurchase(
      packageName || "com.creatorflow.app",
      sku || "creatorflow_vip_monthly",
      purchaseToken
    );

    return res.json(verificationResult);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      verified: false,
      message: err.message || "Verification request failed",
    });
  }
});

// Serve static assets from dist in production
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// For SPA routing, serve index.html for unknown routes
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[CreatorFlow Server] Running on port ${PORT}`);
});
