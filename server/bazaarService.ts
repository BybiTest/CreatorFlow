/**
 * Cafe Bazaar Developer API & In-App Billing (IAB) OAuth Service
 * SECURITY ARCHITECTURE DIRECTIVES:
 * 1. BAZAAR_CLIENT_ID, BAZAAR_CLIENT_SECRET, and BAZAAR_REFRESH_TOKEN are read ONLY from process.env.
 * 2. Secrets are NEVER passed to the Android client, never exposed in client bundles, and never logged.
 * 3. Token exchange (authorization_code -> access_token + refresh_token) is executed exclusively server-side.
 * 4. Refresh token rotation & renewal is performed exclusively on the server.
 * 5. Purchase and subscription verification queries Cafe Bazaar's developer endpoints from this backend.
 */

const CAFE_BAZAAR_AUTH_TOKEN_URL = "https://pardakht.cafebazaar.ir/devapi/v2/auth/token/";
const CAFE_BAZAAR_AUTH_TOKEN_FALLBACKS = [
  "https://pardakht.cafebazaar.ir/devapi/v2/auth/token",
  "https://pardakht.cafebazaar.ir/auth/token/",
];
const CAFE_BAZAAR_DEV_API_BASE = "https://pardakht.cafebazaar.ir/devapi/v2/api";
const CAFE_BAZAAR_AUTHORIZE_URL = "https://pardakht.cafebazaar.ir/devapi/v2/auth/authorize/";

export const DEFAULT_BAZAAR_REDIRECT_URI = "https://github.com/BybiTest/hamid-musavi";

/**
 * Safely executes a fetch to Cafe Bazaar and parses JSON.
 * If HTML or non-JSON is returned (e.g. 404, 502, Cloudflare/Nginx gateway page),
 * extracts the readable message and returns a structured object instead of throwing JSON syntax error.
 */
async function fetchSafeBazaarJson(
  url: string,
  options: RequestInit
): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const response = await fetch(url, options);
    const rawText = await response.text();
    let parsedData: any = null;

    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Server returned HTML or plaintext instead of JSON
      const isHtml = rawText.includes("<html") || rawText.includes("<!DOCTYPE");
      let extractedMessage = "";
      if (isHtml) {
        const titleMatch = rawText.match(/<title>([^<]+)<\/title>/i);
        const headingMatch = rawText.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
        extractedMessage =
          (titleMatch && titleMatch[1].trim()) ||
          (headingMatch && headingMatch[1].replace(/<[^>]+>/g, " ").trim()) ||
          rawText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
      } else {
        extractedMessage = rawText.trim().slice(0, 200);
      }
      parsedData = {
        error: `HTTP_${response.status}`,
        error_description: `Cafe Bazaar server returned non-JSON response (Status ${response.status} ${response.statusText}): ${
          extractedMessage || "Unknown response format"
        }`,
        isHtmlResponse: true,
        httpStatus: response.status,
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      data: parsedData,
    };
  } catch (networkErr: any) {
    return {
      ok: false,
      status: 0,
      data: {
        error: "NETWORK_ERROR",
        error_description: networkErr.message || "Failed to reach Cafe Bazaar servers.",
      },
    };
  }
}

// In-memory token cache for server lifecycle
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let tokenExpiresAt: number = 0; // Milliseconds timestamp

export interface BazaarTokenResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
  details?: any;
}

export interface BazaarAuthStatus {
  clientIdConfigured: boolean;
  clientSecretConfigured: boolean;
  refreshTokenConfigured: boolean;
  hasCachedAccessToken: boolean;
  hasCachedRefreshToken: boolean;
  tokenExpiresInSeconds: number | null;
  mode: "production" | "development_simulated";
  authorizeUrl: string;
  redirectUri: string;
}

export interface BazaarVerificationResult {
  success: boolean;
  verified: boolean;
  mode: "live_bazaar_api";
  packageName: string;
  sku: string;
  purchaseToken: string;
  purchaseData?: any;
  message: string;
  error?: string;
}

/**
 * Builds the Cafe Bazaar OAuth 2.0 Authorization URL.
 * NOTE: redirect_uri is strictly included in this step (Authorization Code request)
 * using the configured unencoded literal value: https://github.com/BybiTest/hamid-musavi
 */
export function getBazaarAuthorizeUrl(
  redirectUri: string = DEFAULT_BAZAAR_REDIRECT_URI
): string {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim() || "";
  const cleanRedirect = redirectUri.trim() || DEFAULT_BAZAAR_REDIRECT_URI;

  // Build query string matching Cafe Bazaar documentation:
  // redirect_uri is sent unencoded as literal "https://github.com/BybiTest/hamid-musavi"
  const queryParts = [
    "response_type=code",
    "access_type=offline",
    `redirect_uri=${cleanRedirect}`,
  ];
  if (clientId) {
    queryParts.push(`client_id=${clientId}`);
  }

  return `${CAFE_BAZAAR_AUTHORIZE_URL}?${queryParts.join("&")}`;
}

/**
 * Returns current status of Cafe Bazaar OAuth configuration without exposing credentials.
 */
export function getBazaarAuthStatus(): BazaarAuthStatus {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.BAZAAR_CLIENT_SECRET?.trim() || "";
  const envRefreshToken = process.env.BAZAAR_REFRESH_TOKEN?.trim() || "";
  const now = Date.now();

  const tokenExpiresInSeconds =
    cachedAccessToken && tokenExpiresAt > now
      ? Math.round((tokenExpiresAt - now) / 1000)
      : null;

  const isConfigured = Boolean(clientId && clientSecret);
  const redirectUri =
    process.env.BAZAAR_REDIRECT_URI?.trim() || DEFAULT_BAZAAR_REDIRECT_URI;
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
    redirectUri,
  };
}

/**
 * Exchange an OAuth authorization code received from Cafe Bazaar for an access_token & refresh_token.
 * In accordance with Cafe Bazaar Developer API:
 * redirect_uri is strictly fixed to https://github.com/BybiTest/hamid-musavi
 *
 * @param code Authorization code from Cafe Bazaar OAuth redirect
 */
export async function exchangeAuthorizationCode(
  code: string
): Promise<BazaarTokenResponse> {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim();
  const clientSecret = process.env.BAZAAR_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "Missing credentials",
      error_description:
        "BAZAAR_CLIENT_ID or BAZAAR_CLIENT_SECRET is missing in environment variables. Please configure in Settings > Secrets.",
    };
  }

  if (!code || typeof code !== "string" || !code.trim()) {
    return {
      success: false,
      error: "Missing code",
      error_description: "An authorization code must be provided for token exchange.",
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

    const postOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: postBody,
    };

    let responseResult = await fetchSafeBazaarJson(CAFE_BAZAAR_AUTH_TOKEN_URL, postOptions);

    // If 404 is encountered on main endpoint, try fallback URLs
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
          attemptedRedirectUri: EXACT_REDIRECT_URI,
        },
      };
    }

    // Cache the newly acquired tokens
    if (data.access_token) {
      cachedAccessToken = data.access_token;
      const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 3600;
      tokenExpiresAt = Date.now() + expiresInSec * 1000;
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
      scope: data.scope,
    };
  } catch (err: any) {
    return {
      success: false,
      error: "Network / Exchange error",
      error_description: err.message || "Failed to contact Cafe Bazaar OAuth token server.",
    };
  }
}

/**
 * Use a refresh_token to acquire a fresh access_token from Cafe Bazaar.
 */
export async function refreshAccessToken(): Promise<BazaarTokenResponse> {
  const clientId = process.env.BAZAAR_CLIENT_ID?.trim();
  const clientSecret = process.env.BAZAAR_CLIENT_SECRET?.trim();
  const refreshToken = (process.env.BAZAAR_REFRESH_TOKEN?.trim() || cachedRefreshToken)?.trim();

  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: "Missing credentials",
      error_description: "BAZAAR_CLIENT_ID or BAZAAR_CLIENT_SECRET is missing.",
    };
  }

  if (!refreshToken) {
    return {
      success: false,
      error: "Missing refresh token",
      error_description:
        "No refresh_token is configured in BAZAAR_REFRESH_TOKEN environment variable or cache. Please complete the OAuth exchange first.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("refresh_token", refreshToken);

    const postOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
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
        error_description:
          data.error_description || "Cafe Bazaar rejected the token refresh request.",
        details: data,
      };
    }

    if (data.access_token) {
      cachedAccessToken = data.access_token;
      const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 3600;
      tokenExpiresAt = Date.now() + expiresInSec * 1000;
    }
    if (data.refresh_token) {
      cachedRefreshToken = data.refresh_token;
    }

    return {
      success: true,
      access_token: data.access_token,
      token_type: data.token_type || "Bearer",
      expires_in: data.expires_in || 3600,
      scope: data.scope,
    };
  } catch (err: any) {
    return {
      success: false,
      error: "Refresh error",
      error_description: err.message || "Failed to refresh Cafe Bazaar access token.",
    };
  }
}

/**
 * Gets a currently valid access token. Automatically refreshes if expired or close to expiry.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const now = Date.now();
  // If we have a cached token with at least 60 seconds of validity remaining, return it
  if (cachedAccessToken && tokenExpiresAt - now > 60000) {
    return cachedAccessToken;
  }
  // Attempt to refresh
  const refreshResult = await refreshAccessToken();
  if (refreshResult.success && refreshResult.access_token) {
    return refreshResult.access_token;
  }
  return null;
}

/**
 * Verifies an in-app purchase or subscription token securely with Cafe Bazaar Developer API.
 * Supports both:
 * - Subscriptions: applications/{packageName}/subscriptions/{sku}/purchases/{token}/
 * - In-App Products: validate/{packageName}/inapp/{sku}/purchases/{token}/
 */
export async function verifyBazaarPurchase(
  packageName: string,
  sku: string,
  purchaseToken: string
): Promise<BazaarVerificationResult> {
  const pkg = packageName || "com.creatorflow.app";
  const accessToken = await getValidAccessToken();

  // Validate input parameters
  if (!purchaseToken || purchaseToken.trim() === "") {
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken: "",
      message: "Purchase token is empty or missing. Cannot verify purchase.",
      error: "INVALID_PURCHASE_TOKEN",
    };
  }

  // Reject simulated/mock tokens explicitly
  if (purchaseToken.startsWith("bazaar_token_") || purchaseToken.includes("simulated") || purchaseToken.includes("test_token")) {
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken,
      message: "Mock and simulated purchase tokens are strictly rejected. A genuine Cafe Bazaar In-App Billing token is required.",
      error: "MOCK_TOKEN_REJECTED",
    };
  }

  // Verification requires active Cafe Bazaar API OAuth credentials on server
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
      message: isConfigured
        ? "Cafe Bazaar developer credentials exist on the server, but no valid access token or active refresh token was found. Exchange your authorization code in the VIP OAuth panel first."
        : "Cafe Bazaar Developer API credentials (BAZAAR_CLIENT_ID, BAZAAR_CLIENT_SECRET, BAZAAR_REFRESH_TOKEN) are not configured on the server. Real purchase verification rejected, and VIP access is not granted.",
      error: "UNVERIFIED_CREDENTIALS_MISSING",
    };
  }

  // Determine whether this SKU is a subscription (VIP Monthly / VIP Yearly) or one-time in-app
  const isSubscription =
    sku === "creatorflow_vip_monthly" ||
    sku === "creatorflow_vip_yearly" ||
    sku.includes("subscription") ||
    sku.includes("monthly") ||
    sku.includes("yearly");

  try {
    let endpointUrl = isSubscription
      ? `${CAFE_BAZAAR_DEV_API_BASE}/applications/${encodeURIComponent(
          pkg
        )}/subscriptions/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
          purchaseToken
        )}/?access_token=${encodeURIComponent(accessToken)}`
      : `${CAFE_BAZAAR_DEV_API_BASE}/validate/${encodeURIComponent(
          pkg
        )}/inapp/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
          purchaseToken
        )}/?access_token=${encodeURIComponent(accessToken)}`;

    let responseResult = await fetchSafeBazaarJson(endpointUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    let { ok, status, data } = responseResult;

    // If subscription endpoint returned 404 and SKU might be in-app (or vice versa), attempt fallback
    if (!ok && status === 404) {
      const fallbackUrl = isSubscription
        ? `${CAFE_BAZAAR_DEV_API_BASE}/validate/${encodeURIComponent(
            pkg
          )}/inapp/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
            purchaseToken
          )}/?access_token=${encodeURIComponent(accessToken)}`
        : `${CAFE_BAZAAR_DEV_API_BASE}/applications/${encodeURIComponent(
            pkg
          )}/subscriptions/${encodeURIComponent(sku)}/purchases/${encodeURIComponent(
            purchaseToken
          )}/?access_token=${encodeURIComponent(accessToken)}`;

      const fallbackResult = await fetchSafeBazaarJson(fallbackUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
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
        purchaseData: data,
      };
    }

    // Determine verification status from Cafe Bazaar payload
    // For Subscriptions: validUntilTimestampMsec must exist and be in the future
    let isVerified = false;
    if (data.validUntilTimestampMsec) {
      isVerified = Number(data.validUntilTimestampMsec) > Date.now();
    } else if (typeof data.purchaseState === "number") {
      // purchaseState: 0 (Purchased), 1 (Canceled), 2 (Refunded)
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
      message: isVerified
        ? "Purchase verified via live Cafe Bazaar Developer API."
        : "Purchase verification failed on Cafe Bazaar servers. Token is expired, invalid, or was canceled/refunded.",
    };
  } catch (err: any) {
    return {
      success: false,
      verified: false,
      mode: "live_bazaar_api",
      packageName: pkg,
      sku,
      purchaseToken,
      message: "Exception connecting to Cafe Bazaar API",
      error: err.message || "Failed to communicate with Cafe Bazaar Developer API.",
    };
  }
}
