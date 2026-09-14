var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_genai = require("@google/genai");

// server/bazaarService.ts
var CAFE_BAZAAR_AUTH_TOKEN_URL = "https://pardakht.cafebazaar.ir/devapi/v2/auth/token/";
var CAFE_BAZAAR_AUTH_TOKEN_FALLBACKS = [
  "https://pardakht.cafebazaar.ir/devapi/v2/auth/token",
  "https://pardakht.cafebazaar.ir/auth/token/"
];
var CAFE_BAZAAR_DEV_API_BASE = "https://pardakht.cafebazaar.ir/devapi/v2/api";
var CAFE_BAZAAR_AUTHORIZE_URL = "https://pardakht.cafebazaar.ir/devapi/v2/auth/authorize/";
var DEFAULT_BAZAAR_REDIRECT_URI = "https://github.com/BybiTest/hamid-musavi";
async function fetchSafeBazaarJson(url, options) {
  try {
    const response = await fetch(url, options);
    const rawText = await response.text();
    let parsedData = null;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const isHtml = rawText.includes("<html") || rawText.includes("<!DOCTYPE");
      let extractedMessage = "";
      if (isHtml) {
        const titleMatch = rawText.match(/<title>([^<]+)<\/title>/i);
        const headingMatch = rawText.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
        extractedMessage = titleMatch && titleMatch[1].trim() || headingMatch && headingMatch[1].replace(/<[^>]+>/g, " ").trim() || rawText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
      } else {
        extractedMessage = rawText.trim().slice(0, 200);
      }
      parsedData = {
        error: `HTTP_${response.status}`,
        error_description: `Cafe Bazaar server returned non-JSON response (Status ${response.status} ${response.statusText}): ${extractedMessage || "Unknown response format"}`,
        isHtmlResponse: true,
        httpStatus: response.status
      };
    }
    return {
      ok: response.ok,
      status: response.status,
      data: parsedData
    };
  } catch (networkErr) {
    return {
      ok: false,
      status: 0,
      data: {
        error: "NETWORK_ERROR",
        error_description: networkErr.message || "Failed to reach Cafe Bazaar servers."
      }
    };
  }
}
var cachedAccessToken = null;
var cachedRefreshToken = null;
var tokenExpiresAt = 0;
function getBazaarAuthorizeUrl(redirectUri = DEFAULT_BAZAAR_REDIRECT_URI) {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim() || "";
  const cleanRedirect = redirectUri.trim() || DEFAULT_BAZAAR_REDIRECT_URI;
  const queryParts = [
    "response_type=code",
    "access_type=offline",
    `redirect_uri=${cleanRedirect}`
  ];
  if (clientId) {
    queryParts.push(`client_id=${clientId}`);
  }
  return `${CAFE_BAZAAR_AUTHORIZE_URL}?${queryParts.join("&")}`;
}
function getBazaarAuthStatus() {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.BAZAAR_CLIENT_SECRET?.trim() || "";
  const envRefreshToken = process.env.BAZAAR_REFRESH_TOKEN?.trim() || "";
  const now = Date.now();
  const tokenExpiresInSeconds = cachedAccessToken && tokenExpiresAt > now ? Math.round((tokenExpiresAt - now) / 1e3) : null;
  const isConfigured = Boolean(clientId && clientSecret);
  const redirectUri = process.env.BAZAAR_REDIRECT_URI?.trim() || DEFAULT_BAZAAR_REDIRECT_URI;
  const authorizeUrl = getBazaarAuthorizeUrl(redirectUri);
  return {
    clientIdConfigured: Boolean(clientId),
    clientSecretConfigured: Boolean(clientSecret),
    refreshTokenConfigured: Boolean(envRefreshToken || cachedRefreshToken),
    hasCachedAccessToken: Boolean(cachedAccessToken && tokenExpiresAt > now),
    hasCachedRefreshToken: Boolean(envRefreshToken || cachedRefreshToken),
    tokenExpiresInSeconds,
    mode: isConfigured ? "production" : "development_simulated",
    authorizeUrl,
    redirectUri
  };
}
async function exchangeAuthorizationCode(code) {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim();
  const clientSecret = process.env.BAZAAR_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "Missing credentials",
      error_description: "BAZAAR_CLIENT_ID or BAZAAR_CLIENT_SECRET is missing in environment variables. Please configure in Settings > Secrets."
    };
  }
  if (!code || typeof code !== "string" || !code.trim()) {
    return {
      success: false,
      error: "Missing code",
      error_description: "An authorization code must be provided for token exchange."
    };
  }
  const EXACT_REDIRECT_URI = "https://github.com/BybiTest/hamid-musavi";
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code.trim());
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("redirect_uri", EXACT_REDIRECT_URI);
    const postBody = params.toString();
    console.log(
      `[CafeBazaar Token Exchange] Sending POST to ${CAFE_BAZAAR_AUTH_TOKEN_URL} with redirect_uri: ${EXACT_REDIRECT_URI}`
    );
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: postBody
    };
    let responseResult = await fetchSafeBazaarJson(CAFE_BAZAAR_AUTH_TOKEN_URL, postOptions);
    if (!responseResult.ok && responseResult.status === 404) {
      for (const fallbackUrl of CAFE_BAZAAR_AUTH_TOKEN_FALLBACKS) {
        const retryResult = await fetchSafeBazaarJson(fallbackUrl, postOptions);
        if (retryResult.ok || retryResult.status !== 404) {
          responseResult = retryResult;
          break;
        }
      }
    }
    const { ok, status, data } = responseResult;
    if (!ok || data?.error) {
      let friendlyDesc = data?.error_description || "Cafe Bazaar rejected the authorization code exchange.";
      if (data?.error === "redirect_uri_mismatch") {
        friendlyDesc = `Redirect URI Mismatch: Cafe Bazaar rejected the redirect URI (${EXACT_REDIRECT_URI}). Please ensure this EXACT URL is registered in the Cafe Bazaar Developer Console.`;
      } else if (data?.error === "invalid_grant") {
        friendlyDesc = "Invalid or expired authorization code. Authorization codes can only be used once and expire within 5-10 minutes. Please request a new code from Cafe Bazaar.";
      } else if (data?.error === "invalid_client") {
        friendlyDesc = "Invalid Client: Cafe Bazaar rejected your BAZAAR_CLIENT_ID or BAZAAR_CLIENT_SECRET. Please verify credentials in Settings > Secrets.";
      }
      return {
        success: false,
        error: data?.error || `HTTP_${status}`,
        error_description: friendlyDesc,
        details: {
          status,
          rawResponse: data,
          attemptedRedirectUri: EXACT_REDIRECT_URI
        }
      };
    }
    if (data.access_token) {
      cachedAccessToken = data.access_token;
      const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 3600;
      tokenExpiresAt = Date.now() + expiresInSec * 1e3;
    }
    if (data.refresh_token) {
      cachedRefreshToken = data.refresh_token;
    }
    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type || "Bearer",
      expires_in: data.expires_in || 3600,
      scope: data.scope
    };
  } catch (err) {
    return {
      success: false,
      error: "Network / Exchange error",
      error_description: err.message || "Failed to contact Cafe Bazaar OAuth token server."
    };
  }
}
async function refreshAccessToken() {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim();
  const clientSecret = process.env.BAZAAR_CLIENT_SECRET?.trim();
  const refreshToken = (process.env.BAZAAR_REFRESH_TOKEN?.trim() || cachedRefreshToken)?.trim();
  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "Missing credentials",
      error_description: "BAZAAR_CLIENT_ID or BAZAAR_CLIENT_SECRET is missing."
    };
  }
  if (!refreshToken) {
    return {
      success: false,
      error: "Missing refresh token",
      error_description: "No refresh_token is configured in BAZAAR_REFRESH_TOKEN environment variable or cache. Please complete the OAuth exchange first."
    };
  }
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("refresh_token", refreshToken);
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: params.toString()
    };
    let responseResult = await fetchSafeBazaarJson(CAFE_BAZAAR_AUTH_TOKEN_URL, postOptions);
    if (!responseResult.ok && responseResult.status === 404) {
      for (const fallbackUrl of CAFE_BAZAAR_AUTH_TOKEN_FALLBACKS) {
        const retryResult = await fetchSafeBazaarJson(fallbackUrl, postOptions);
        if (retryResult.ok || retryResult.status !== 404) {
          responseResult = retryResult;
          break;
        }
      }
    }
    const { ok, status, data } = responseResult;
    if (!ok || data.error) {
      return {
        success: false,
        error: data.error || `HTTP_${status}`,
        error_description: data.error_description || "Cafe Bazaar rejected the token refresh request.",
        details: data
      };
    }
    if (data.access_token) {
      cachedAccessToken = data.access_token;
      const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 3600;
      tokenExpiresAt = Date.now() + expiresInSec * 1e3;
    }
    if (data.refresh_token) {
      cachedRefreshToken = data.refresh_token;
    }
    return {
      success: true,
      access_token: data.access_token,
      token_type: data.token_type || "Bearer",
      expires_in: data.expires_in || 3600,
      scope: data.scope
    };
  } catch (err) {
    return {
      success: false,
      error: "Refresh error",
      error_description: err.message || "Failed to refresh Cafe Bazaar access token."
    };
  }
}
async function getValidAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && tokenExpiresAt - now > 6e4) {
    return cachedAccessToken;
  }
  const refreshResult = await refreshAccessToken();
  if (refreshResult.success && refreshResult.access_token) {
    return refreshResult.access_token;
  }
  return null;
}
async function verifyBazaarPurchase(packageName, sku, purchaseToken) {
  const pkg = packageName || "com.creatorflow.app";
  const accessToken = await getValidAccessToken();
  if (!purchaseToken || purchaseToken.trim() === "") {
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken: "",
      message: "Purchase token is empty or missing. Cannot verify purchase.",
      error: "INVALID_PURCHASE_TOKEN"
    };
  }
  if (purchaseToken.startsWith("bazaar_token_") || purchaseToken.includes("simulated") || purchaseToken.includes("test_token")) {
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken,
      message: "Mock and simulated purchase tokens are strictly rejected. A genuine Cafe Bazaar In-App Billing token is required.",
      error: "MOCK_TOKEN_REJECTED"
    };
  }
  if (!accessToken) {
    const isConfigured = Boolean(
      process.env.BAZAAR_CLIENT_ID && process.env.BAZAAR_CLIENT_SECRET
    );
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken,
      message: isConfigured ? "Cafe Bazaar developer credentials exist on the server, but no valid access token or active refresh token was found. Exchange your authorization code in the VIP OAuth panel first." : "Cafe Bazaar Developer API credentials (BAZAAR_CLIENT_ID, BAZAAR_CLIENT_SECRET, BAZAAR_REFRESH_TOKEN) are not configured on the server. Real purchase verification rejected, and VIP access is not granted.",
      error: "UNVERIFIED_CREDENTIALS_MISSING"
    };
  }
  const isSubscription = sku === "creatorflow_vip_monthly" || sku === "creatorflow_vip_yearly" || sku.includes("subscription") || sku.includes("monthly") || sku.includes("yearly");
  try {
    let endpointUrl = isSubscription ? `${CAFE_BAZAAR_DEV_API_BASE}/applications/${encodeURIComponent(
      pkg
    )}/subscriptions/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
      purchaseToken
    )}/?access_token=${encodeURIComponent(accessToken)}` : `${CAFE_BAZAAR_DEV_API_BASE}/validate/${encodeURIComponent(
      pkg
    )}/inapp/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
      purchaseToken
    )}/?access_token=${encodeURIComponent(accessToken)}`;
    let responseResult = await fetchSafeBazaarJson(endpointUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
    let { ok, status, data } = responseResult;
    if (!ok && status === 404) {
      const fallbackUrl = isSubscription ? `${CAFE_BAZAAR_DEV_API_BASE}/validate/${encodeURIComponent(
        pkg
      )}/inapp/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
        purchaseToken
      )}/?access_token=${encodeURIComponent(accessToken)}` : `${CAFE_BAZAAR_DEV_API_BASE}/applications/${encodeURIComponent(
        pkg
      )}/subscriptions/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
        purchaseToken
      )}/?access_token=${encodeURIComponent(accessToken)}`;
      const fallbackResult = await fetchSafeBazaarJson(fallbackUrl, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
      if (fallbackResult.ok) {
        ok = fallbackResult.ok;
        status = fallbackResult.status;
        data = fallbackResult.data;
      }
    }
    if (!ok) {
      return {
        success: false,
        verified: false,
        mode: "live_bazaar_api",
        packageName: pkg,
        sku,
        purchaseToken,
        message: "Cafe Bazaar verification failed.",
        error: data.error_description || data.error || `HTTP_${status}`,
        purchaseData: data
      };
    }
    let isVerified = false;
    if (data.validUntilTimestampMsec) {
      isVerified = Number(data.validUntilTimestampMsec) > Date.now();
    } else if (typeof data.purchaseState === "number") {
      isVerified = data.purchaseState === 0;
    } else if (typeof data.consumptionState === "number" && typeof data.developerPayload === "string") {
      isVerified = data.consumptionState === 0;
    }
    return {
      success: isVerified,
      verified: isVerified,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken,
      purchaseData: data,
      message: isVerified ? "Purchase verified via live Cafe Bazaar Developer API." : "Purchase verification failed on Cafe Bazaar servers. Token is expired, invalid, or was canceled/refunded."
    };
  } catch (err) {
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken,
      message: "Exception connecting to Cafe Bazaar API",
      error: err.message || "Failed to communicate with Cafe Bazaar Developer API."
    };
  }
}

// server.ts
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var genAiClient = null;
function getGenAi() {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    genAiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return genAiClient;
}
app.post("/api/generate", async (req, res) => {
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
        systemInstruction: systemInstruction || void 0,
        temperature: 0.7
      }
    });
    const text = response.text || "";
    return res.json({ text });
  } catch (error) {
    console.error("[Gemini API Error]", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI content."
    });
  }
});
app.get("/api/bazaar/status", (req, res) => {
  try {
    const status = getBazaarAuthStatus();
    return res.json(status);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/bazaar/authorize-url", (req, res) => {
  try {
    const requestedRedirect = typeof req.query.redirect_uri === "string" ? req.query.redirect_uri : void 0;
    const url = getBazaarAuthorizeUrl(requestedRedirect);
    return res.json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/bazaar/exchange", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: "Missing authorization code",
        error_description: "Please provide a valid code parameter in JSON body."
      });
    }
    const result = await exchangeAuthorizationCode(code.trim());
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
      error_description: err.message || "Internal server error during token exchange."
    });
  }
});
app.get("/api/bazaar/callback", (req, res) => {
  const { code, error } = req.query;
  if (code && typeof code === "string") {
    return res.redirect(`/?code=${encodeURIComponent(code)}#vip`);
  }
  return res.redirect(`/?error=${encodeURIComponent(String(error || "oauth_failed"))}#vip`);
});
app.post("/api/bazaar/refresh", async (req, res) => {
  try {
    const result = await refreshAccessToken();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
      error_description: err.message || "Internal server error during token refresh."
    });
  }
});
app.post("/api/bazaar/verify", async (req, res) => {
  try {
    const { packageName, sku, purchaseToken } = req.body;
    if (!purchaseToken) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "purchaseToken is required"
      });
    }
    const verificationResult = await verifyBazaarPurchase(
      packageName || "com.creatorflow.app",
      sku || "creatorflow_vip_monthly",
      purchaseToken
    );
    return res.json(verificationResult);
  } catch (err) {
    return res.status(500).json({
      success: false,
      verified: false,
      message: err.message || "Verification request failed"
    });
  }
});
var distPath = import_path.default.resolve(__dirname, "dist");
app.use(import_express.default.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(import_path.default.join(distPath, "index.html"));
});
app.listen(PORT, () => {
  console.log(`[CreatorFlow Server] Running on port ${PORT}`);
});
//# sourceMappingURL=server.cjs.map
