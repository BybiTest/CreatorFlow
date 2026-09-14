import React, { useState, useEffect } from "react";
import {
  Crown,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  ExternalLink,
  Key,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { UserSettings, VIPPlan } from "../types";
import { translations } from "../translations";

interface VIPPaywallProps {
  settings: UserSettings;
  isVIP: boolean;
  onVIPActivated: () => void;
  onOpenAdModal: () => void;
}

interface BazaarStatusData {
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

export const VIPPaywall: React.FC<VIPPaywallProps> = ({
  settings,
  isVIP,
  onVIPActivated,
  onOpenAdModal,
}) => {
  const t = translations[settings.language];
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [authCodeInput, setAuthCodeInput] = useState("");
  const [redirectUriInput, setRedirectUriInput] = useState("https://github.com/BybiTest/hamid-musavi");
  const [purchaseTokenInput, setPurchaseTokenInput] = useState("");
  const [isExchanging, setIsExchanging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bazaarStatus, setBazaarStatus] = useState<BazaarStatusData | null>(null);
  const [exchangeResult, setExchangeResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [showOAuthDetails, setShowOAuthDetails] = useState(false);

  // Fetch Bazaar Status on load
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/bazaar/status");
      if (res.ok) {
        const data = await res.json();
        setBazaarStatus(data);
        if (data.redirectUri && !redirectUriInput) {
          setRedirectUriInput(data.redirectUri);
        }
      }
    } catch (err) {
      console.warn("Could not fetch Bazaar status", err);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Check if window URL has ?code= from OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    if (codeParam) {
      setAuthCodeInput(codeParam);
      setShowOAuthDetails(true);
    }

    // Check if window URL has purchase_token or token from payment redirect
    const purchaseTokenParam =
      urlParams.get("purchase_token") ||
      urlParams.get("purchaseToken") ||
      urlParams.get("token");
    const skuParam = urlParams.get("sku");
    if (purchaseTokenParam) {
      setPurchaseTokenInput(purchaseTokenParam);
      if (skuParam === "creatorflow_vip_yearly" || skuParam === "creatorflow_vip_monthly") {
        setSelectedPlan(skuParam === "creatorflow_vip_yearly" ? "yearly" : "monthly");
      }
      handleVerifyPurchase(purchaseTokenParam, skuParam || undefined);
    }

    // Register native Android / Poolkey JavascriptInterface callbacks
    const handleNativePurchaseSuccess = (token: string, purchasedSku?: string) => {
      if (!token) return;
      const effectiveSku =
        purchasedSku ||
        (selectedPlan === "yearly" ? "creatorflow_vip_yearly" : "creatorflow_vip_monthly");
      setPurchaseTokenInput(token);
      handleVerifyPurchase(token, effectiveSku);
    };

    (window as any).onBazaarPurchaseSuccess = handleNativePurchaseSuccess;
    (window as any).onBazaarPurchase = handleNativePurchaseSuccess;
    (window as any).handleBazaarPaymentResult = handleNativePurchaseSuccess;

    return () => {
      delete (window as any).onBazaarPurchaseSuccess;
      delete (window as any).onBazaarPurchase;
      delete (window as any).handleBazaarPaymentResult;
    };
  }, [selectedPlan]);

  const handleExchangeCode = async () => {
    if (!authCodeInput.trim()) return;
    setIsExchanging(true);
    setExchangeResult(null);

    try {
      const res = await fetch("/api/bazaar/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: authCodeInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExchangeResult({
          success: true,
          message:
            settings.language === "fa"
              ? "تبادل توکن با موفقیت انجام شد! Access Token و Refresh Token دریافت و در سرور ذخیره شدند."
              : "Token exchange successful! Tokens securely cached on server.",
          details: data,
        });
        fetchStatus();
      } else {
        setExchangeResult({
          success: false,
          message:
            data.error_description ||
            data.error ||
            (settings.language === "fa"
              ? "خطا در تبادل کد تایید با سرور کافه‌بازار"
              : "Failed to exchange authorization code"),
          details: data,
        });
      }
    } catch (err: any) {
      setExchangeResult({
        success: false,
        message: err.message || "Network error contacting server",
      });
    } finally {
      setIsExchanging(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/bazaar/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setExchangeResult({
          success: true,
          message:
            settings.language === "fa"
              ? "توکن دسترسی جدید با موفقیت صادر شد."
              : "Access token successfully refreshed.",
          details: data,
        });
        fetchStatus();
      } else {
        setExchangeResult({
          success: false,
          message: data.error_description || "Refresh failed",
          details: data,
        });
      }
    } catch (err: any) {
      setExchangeResult({
        success: false,
        message: err.message,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVerifyPurchase = async (overrideToken?: string, overrideSku?: string) => {
    const token = (overrideToken || purchaseTokenInput).trim();
    if (!token) return;
    setIsVerifying(true);
    setVerifyResult(null);

    const sku =
      overrideSku ||
      (selectedPlan === "yearly" ? "creatorflow_vip_yearly" : "creatorflow_vip_monthly");

    try {
      const res = await fetch("/api/bazaar/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: "com.creatorflow.app",
          sku,
          purchaseToken: token,
        }),
      });

      const data = await res.json();
      if (data.verified) {
        setVerifyResult({
          success: true,
          message:
            settings.language === "fa"
              ? "خرید واقعی شما از کافه‌بازار با موفقیت اعتبارسنجی شد. اشتراک VIP فعال شد!"
              : "Purchase verified via Cafe Bazaar Developer API! VIP subscription activated.",
          details: data,
        });
        onVIPActivated();
      } else {
        setVerifyResult({
          success: false,
          message:
            data.message ||
            (settings.language === "fa"
              ? "اعتبارسنجی ناموفق بود. توکن معتبر نیست یا پرداخت صورت نگرفته است."
              : "Verification failed. Token is invalid or canceled."),
          details: data,
        });
      }
    } catch (err: any) {
      setVerifyResult({
        success: false,
        message: err.message || "Failed to communicate with verification API",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInitiateBazaarPurchase = (plan: VIPPlan) => {
    setSelectedPlan(plan.id);

    // 1. Native Android / Poolkey JavaScriptInterface bridge
    const win = window as any;
    if (typeof win.BazaarBilling?.purchaseProduct === "function") {
      win.BazaarBilling.purchaseProduct(plan.bazaarSku);
      return;
    }
    if (typeof win.Android?.purchaseProduct === "function") {
      win.Android.purchaseProduct(plan.bazaarSku);
      return;
    }
    if (typeof win.Android?.purchase === "function") {
      win.Android.purchase(plan.bazaarSku);
      return;
    }

    // 2. Android device deep link / intent for Cafe Bazaar In-App Billing
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = `bazaar://pardakht?id=com.creatorflow.app&sku=${encodeURIComponent(plan.bazaarSku)}`;
      return;
    }

    // 3. Web environment fallback: scroll to and focus the purchaseToken input
    const inputEl = document.getElementById("input-bazaar-purchase-token");
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      inputEl.focus();
    }
  };

  const plans: VIPPlan[] = [
    {
      id: "monthly",
      name: settings.language === "fa" ? "اشتراک ماهانه" : "Monthly VIP",
      price: settings.language === "fa" ? "۱۹۹,۰۰۰ تومان" : "$4.99 / mo",
      duration: settings.language === "fa" ? "۳۰ روز دسترسی کامل" : "30 Days Full Access",
      bazaarSku: "creatorflow_vip_monthly",
      features: [
        settings.language === "fa" ? "تولید نامحدود سناریو و هوک با جمینای" : "Unlimited Script & Hook Generation",
        settings.language === "fa" ? "دسترسی به تمام قالب‌های تامبنیل و استوری" : "All Thumbnail & Story Templates",
        settings.language === "fa" ? "حذف کامل تبلیغات تپسل" : "100% Ad-Free Experience",
        settings.language === "fa" ? "خروجی مستقیم کدهای اندروید" : "Direct Android Kotlin Export",
      ],
    },
    {
      id: "yearly",
      name: settings.language === "fa" ? "اشتراک سالانه (به‌صرفه)" : "Yearly VIP (Best Value)",
      price: settings.language === "fa" ? "۱,۱۹۰,۰۰۰ تومان" : "$39.99 / yr",
      duration: settings.language === "fa" ? "۳۶۵ روز (۵۰٪ تخفیف ویژه)" : "365 Days (50% OFF)",
      bazaarSku: "creatorflow_vip_yearly",
      isPopular: true,
      features: [
        settings.language === "fa" ? "تمام امکانات اشتراک ماهانه" : "All Monthly Features Included",
        settings.language === "fa" ? "۵۰٪ تخفیف نسبت به پرداخت ماهانه" : "50% Savings Compared to Monthly",
        settings.language === "fa" ? "اولویت در پاسخ‌دهی پردازش هوش مصنوعی" : "Priority AI Processing Queue",
        settings.language === "fa" ? "پشتیبانی اختصاصی توسعه‌دهنده" : "Dedicated Creator Support",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-neutral-900 to-purple-950/40 p-6 sm:p-8 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 mb-1">
          <Crown className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{t.vip.title}</h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
          {t.vip.subtitle}
        </p>

        {isVIP && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.vip.activeBadge}</span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleInitiateBazaarPurchase(plan)}
            className={`relative rounded-2xl p-6 border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === plan.id
                ? "border-amber-500 bg-neutral-900/90 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500"
                : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-[10px] tracking-wider uppercase">
                {t.vip.popular}
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{plan.duration}</span>
                </div>
                <div className="text-right rtl:text-left">
                  <div className="text-xl font-black text-white font-mono">{plan.price}</div>
                  <span className="text-[10px] text-neutral-400 font-mono">SKU: {plan.bazaarSku}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 space-y-2.5 text-xs text-neutral-300">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800">
              <button
                type="button"
                id={`btn-plan-${plan.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInitiateBazaarPurchase(plan);
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-colors cursor-pointer ${
                  selectedPlan === plan.id
                    ? "bg-amber-500 text-neutral-950"
                    : "bg-neutral-800 text-neutral-300"
                }`}
              >
                {selectedPlan === plan.id ? "انتخاب شده" : "انتخاب پلن"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative: Free Tokens via Tapsell */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-300">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{t.vip.freeWithAds}</h4>
            <p className="text-xs text-neutral-400">
              {settings.language === "fa"
                ? "با مشاهده ویدیوی تبلیغاتی تپسل، ۳ توکن هوش مصنوعی هدیه بگیرید."
                : "Watch a short sponsored video to unlock 3 complimentary AI tokens."}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAdModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center whitespace-nowrap"
        >
          {t.vip.watchAd}
        </button>
      </div>

      {/* Real Cafe Bazaar Purchase Verification Box */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              {settings.language === "fa"
                ? "اعتبارسنجی مستقیم توکن خرید از کافه‌بازار (Poolkey IAB)"
                : "Verify Real Cafe Bazaar Purchase Token"}
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
            Server Cryptographic Verification
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          {settings.language === "fa"
            ? "توکن خرید (purchaseToken) صادر شده توسط کتابخانه رسمی Poolkey در کلاینت اندروید را وارد کنید. سرور اختصاصی برنامه صحت خرید را مستقیماً از طریق API رسمی سرورهای کافه‌بازار استعلام می‌کند."
            : "Enter the real purchaseToken returned by Cafe Bazaar's in-app billing SDK. The server verifies its authenticity directly with the Cafe Bazaar Developer API."}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="input-bazaar-purchase-token"
            type="text"
            value={purchaseTokenInput}
            onChange={(e) => setPurchaseTokenInput(e.target.value)}
            placeholder={
              settings.language === "fa"
                ? "توکن خرید کافه‌بازار (purchaseToken)..."
                : "Cafe Bazaar purchase token..."
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
          />
          <button
            id="btn-verify-bazaar-purchase"
            onClick={() => handleVerifyPurchase()}
            disabled={isVerifying || !purchaseTokenInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>در حال استعلام...</span>
              </>
            ) : (
              <span>اعتبارسنجی و فعال‌سازی VIP</span>
            )}
          </button>
        </div>

        {verifyResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              verifyResult.success
                ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                : "border-red-500/40 bg-red-950/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {verifyResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{verifyResult.message}</span>
            </div>
            {verifyResult.details?.error && (
              <p className="font-mono text-[11px] text-red-400 pt-1">
                کد خطا: {verifyResult.details.error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Developer OAuth Control Panel */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
        <button
          onClick={() => setShowOAuthDetails(!showOAuthDetails)}
          className="w-full p-4 bg-neutral-900/60 hover:bg-neutral-900 flex items-center justify-between text-left rtl:text-right transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-xs text-white">
              {settings.language === "fa"
                ? "پنل مدیریت اتصال و تبادل کلید OAuth کافه‌بازار"
                : "Cafe Bazaar OAuth 2.0 Management Panel"}
            </span>
            {bazaarStatus?.hasCachedAccessToken && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                Access Token Active
              </span>
            )}
          </div>
          {showOAuthDetails ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {showOAuthDetails && (
          <div className="p-5 border-t border-neutral-800 space-y-4 text-xs">
            {/* Server Status Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Client ID</span>
                <span
                  className={`font-mono font-bold ${
                    bazaarStatus?.clientIdConfigured ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {bazaarStatus?.clientIdConfigured ? "Configured" : "Missing"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Client Secret</span>
                <span
                  className={`font-mono font-bold ${
                    bazaarStatus?.clientSecretConfigured ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {bazaarStatus?.clientSecretConfigured ? "Configured" : "Missing"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Access Token</span>
                <span
                  className={`font-mono font-bold ${
                    bazaarStatus?.hasCachedAccessToken ? "text-emerald-400" : "text-neutral-500"
                  }`}
                >
                  {bazaarStatus?.hasCachedAccessToken
                    ? `Active (${bazaarStatus.tokenExpiresInSeconds}s)`
                    : "None"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Refresh Token</span>
                <span
                  className={`font-mono font-bold ${
                    bazaarStatus?.refreshTokenConfigured ? "text-emerald-400" : "text-neutral-500"
                  }`}
                >
                  {bazaarStatus?.refreshTokenConfigured ? "Available" : "None"}
                </span>
              </div>
            </div>

            {/* Step 1: Open Authorize URL */}
            <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  مرحله ۱: دریافت کد تایید (Authorization Code)
                </span>
                {bazaarStatus?.authorizeUrl && (
                  <a
                    href={bazaarStatus.authorizeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300"
                  >
                    <span>ورود و تایید دسترسی در کافه‌بازار</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                آدرس Redirect URI ثبت‌شده در پنل توسعه‌دهندگان کافه‌بازار:
              </p>
              <div className="p-2 rounded-lg bg-neutral-950 font-mono text-[11px] text-amber-300 break-all border border-neutral-800">
                {bazaarStatus?.redirectUri || "https://github.com/BybiTest/hamid-musavi"}
              </div>
            </div>

            {/* Step 2: Exchange Code */}
            <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <span className="font-bold text-white block">
                مرحله ۲: تبادل کد تایید برای دریافت Access & Refresh Token
              </span>
              <p className="text-[11px] text-neutral-400">
                کد دریافتی از URL بازگشتی را در کادر زیر وارد کنید:
              </p>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Redirect URI استفاده شده در تایید:</label>
                  <input
                    type="text"
                    value="https://github.com/BybiTest/hamid-musavi"
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-amber-300 text-xs focus:outline-none cursor-default"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={authCodeInput}
                    onChange={(e) => setAuthCodeInput(e.target.value)}
                    placeholder="کد تایید دریافتی (Authorization Code)..."
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleExchangeCode}
                    disabled={isExchanging || !authCodeInput.trim()}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isExchanging ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>در حال تبادل...</span>
                      </>
                    ) : (
                      <span>تبادل کد (Exchange)</span>
                    )}
                  </button>
                  {bazaarStatus?.refreshTokenConfigured && (
                    <button
                      onClick={handleRefreshToken}
                      disabled={isRefreshing}
                      className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1"
                      title="تمدید Access Token با Refresh Token فعلی"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                      <span>تمدید توکن</span>
                    </button>
                  )}
                </div>
              </div>

              {exchangeResult && (
                <div
                  className={`mt-2 p-3 rounded-lg border text-xs ${
                    exchangeResult.success
                      ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                      : "border-red-500/40 bg-red-950/30 text-red-300"
                  }`}
                >
                  <p className="font-semibold">{exchangeResult.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
