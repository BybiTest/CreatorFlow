import React from "react";
import {
  Sparkles,
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Smartphone,
  TrendingUp,
  Calendar,
  Crown,
  Tv,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
} from "lucide-react";
import { ScreenType, UserSettings } from "../types";
import { translations } from "../translations";

interface DashboardProps {
  onSelectScreen: (screen: ScreenType) => void;
  settings: UserSettings;
  onOpenTapsellAd: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectScreen,
  settings,
  onOpenTapsellAd,
}) => {
  const t = translations[settings.language];
  const isRtl = settings.language === "fa";

  const toolCards = [
    {
      id: "ai-assistant" as ScreenType,
      title: t.nav.aiAssistant,
      desc: settings.language === "fa" ? "چت هوشمند تدوین استراتژی، قلاب و فیلم‌نامه" : "Multi-turn YouTube strategy & retention chat",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      accent: "from-purple-900/30 to-indigo-900/10 border-purple-500/30 hover:border-purple-400",
      tag: "AI Powered",
    },
    {
      id: "content-ideas" as ScreenType,
      title: t.nav.contentIdeas,
      desc: settings.language === "fa" ? "ایده‌های وایرال با نرخ کلیک و جذابیت بالا" : "High-CTR video concepts and viral angles",
      icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
      accent: "from-amber-900/30 to-yellow-900/10 border-amber-500/30 hover:border-amber-400",
      tag: "Algorithm",
    },
    {
      id: "hooks-scripts" as ScreenType,
      title: t.nav.hooksScripts,
      desc: settings.language === "fa" ? "قلاب‌های کنجکاوی، راهنمای بصری و فیلم‌نامه کامل" : "Retention hooks, visual cues & full scripts",
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      accent: "from-cyan-900/30 to-blue-900/10 border-cyan-500/30 hover:border-cyan-400",
      tag: "Retention",
    },
    {
      id: "thumbnail-studio" as ScreenType,
      title: t.nav.thumbnailStudio,
      desc: settings.language === "fa" ? "طراحی کاور ۱۶:۹ با قالب‌ها و خروجی PNG" : "16:9 canvas editor, typography & PNG export",
      icon: <ImageIcon className="w-6 h-6 text-pink-400" />,
      accent: "from-pink-900/30 to-rose-900/10 border-pink-500/30 hover:border-pink-400",
      tag: "Studio",
    },
    {
      id: "story-studio" as ScreenType,
      title: t.nav.storyStudio,
      desc: settings.language === "fa" ? "قالب‌های عمودی ۹:۱۶ ویژه استوری اینستاگرام" : "Vertical 9:16 templates & story authoring",
      icon: <Smartphone className="w-6 h-6 text-indigo-400" />,
      accent: "from-indigo-900/30 to-purple-900/10 border-indigo-500/30 hover:border-indigo-400",
      tag: "Social",
    },
    {
      id: "growth-roadmap" as ScreenType,
      title: t.nav.growthRoadmap,
      desc: settings.language === "fa" ? "مسیر ۱۰۰۰ سابسکرایبر و ۴۰۰۰ ساعت واچ‌تایم" : "1K Subs & 4K Watch Hours monetization path",
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      accent: "from-emerald-900/30 to-teal-900/10 border-emerald-500/30 hover:border-emerald-400",
      tag: "Roadmap",
    },
    {
      id: "planner" as ScreenType,
      title: t.nav.planner,
      desc: settings.language === "fa" ? "مدیریت پایپ‌لاین تولید: از ایده تا انتشار" : "Production pipeline: Idea to Published",
      icon: <Calendar className="w-6 h-6 text-blue-400" />,
      accent: "from-blue-900/30 to-sky-900/10 border-blue-500/30 hover:border-blue-400",
      tag: "Pipeline",
    },
    {
      id: "vip" as ScreenType,
      title: t.nav.vip,
      desc: settings.language === "fa" ? "پرداخت رسمی کافه‌بازار و امکانات نامحدود" : "Cafe Bazaar In-App Billing & unlimited perks",
      icon: <Crown className="w-6 h-6 text-amber-400" />,
      accent: "from-amber-950/40 to-yellow-900/20 border-amber-500/40 hover:border-amber-300",
      tag: "VIP Pro",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-6 sm:p-8 shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>{settings.language === "fa" ? "استودیو CreatorFlow نسخه ۱.۰" : "CreatorFlow AI Studio v1.0"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.dashboard.welcome}
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              {t.dashboard.welcomeSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{settings.language === "fa" ? "موتور Gemini فعال است" : "Gemini AI Engine Active"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {t.dashboard.vipStatus}{" "}
                  <strong className={settings.isVip ? "text-amber-400" : "text-neutral-400"}>
                    {settings.isVip ? t.dashboard.vipActive : t.dashboard.freeTier}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  {settings.language === "fa"
                    ? `توکن رایگان باقی‌مانده: ${settings.freeGenerationsRemaining}`
                    : `Free Tokens: ${settings.freeGenerationsRemaining}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
            <button
              id="btn-hero-launch-ai"
              onClick={() => onSelectScreen("ai-assistant")}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-700/25 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.aiAssistant}</span>
            </button>
            <button
              id="btn-hero-upgrade-vip"
              onClick={() => onSelectScreen("vip")}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2 transition-all"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{t.dashboard.upgradeBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tapsell Rewarded Video & Banner Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-neutral-900/60 to-orange-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Tapsell Plus SDK
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-700/40">
                  Rewarded Ad
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {t.dashboard.tapsellRewardCard}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Ad ID: 6aa84a381f07c00619f451f1
              </p>
            </div>
          </div>
          <button
            id="btn-dashboard-watch-ad"
            onClick={onOpenTapsellAd}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-md shadow-amber-500/10 whitespace-nowrap self-start sm:self-center"
          >
            {t.dashboard.watchAdBtn}
          </button>
        </div>

        {/* Tapsell Standard Banner Card */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">
              {t.tapsell.bannerTitle}
            </span>
            <span className="text-[10px] font-mono text-purple-400">Tapsell Banner</span>
          </div>
          <div className="my-2 py-3 px-3 rounded-lg border border-dashed border-neutral-700 bg-neutral-950/70 text-center">
            <p className="text-xs font-semibold text-neutral-300">
              {settings.language === "fa" ? "جایگاه رسمی تبلیغات بنری تپسل" : "Official Tapsell Banner Placement"}
            </p>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
              Zone ID: 6aa84a4fcd33cd4ed6e43287
            </p>
          </div>
          <span className="text-[10px] text-neutral-500">
            {settings.language === "fa" ? "در حساب VIP این تبلیغات به صورت خودکار حذف می‌شوند" : "Removed automatically in VIP tier"}
          </span>
        </div>
      </section>

      {/* Main Studio Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{t.dashboard.quickActions}</h2>
            <p className="text-xs text-neutral-400">
              {settings.language === "fa" ? "ماژول‌های ضروری تولید محتوا و بهینه‌سازی کانال" : "Essential creator growth and production modules"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolCards.map((tool) => (
            <div
              key={tool.id}
              id={`tool-card-${tool.id}`}
              onClick={() => onSelectScreen(tool.id)}
              className={`group cursor-pointer rounded-xl border bg-gradient-to-b ${tool.accent} bg-neutral-950 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800">
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-snug">
                    {tool.desc}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-white">
                <span>{settings.language === "fa" ? "ورود به بخش" : "Launch"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Creator Retention Checklist & Growth Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Checklist */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{t.dashboard.dailyChecklist}</span>
            </h3>
            <span className="text-xs text-neutral-400 font-medium">
              {settings.language === "fa" ? "استانداردهای سال ۲۰۲۶ یوتیوب" : "2026 YouTube Standards"}
            </span>
          </div>

          <div className="space-y-3">
            {[
              t.dashboard.checklistItem1,
              t.dashboard.checklistItem2,
              t.dashboard.checklistItem3,
              t.dashboard.checklistItem4,
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
              >
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border border-neutral-700 bg-neutral-900 flex items-center justify-center text-xs font-bold text-purple-400">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Credit & Architecture Summary */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-purple-500/40 bg-neutral-900 flex items-center justify-center">
                <img src="/icon.png" alt="CreatorFlow" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">CreatorFlow</h4>
                <p className="text-[11px] text-neutral-400">com.creatorflow.app</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>{t.developerLabel}</span>
                <span className="text-purple-300 font-bold">{t.developerName}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>{settings.language === "fa" ? "معماری:" : "Architecture:"}</span>
                <span className="text-white font-mono">MVVM + Jetpack Compose</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>{settings.language === "fa" ? "دیتابیس آفلاین:" : "Local Persistence:"}</span>
                <span className="text-white font-mono">Android Room DB</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>{settings.language === "fa" ? "شبکه تبلیغات:" : "Ad Network:"}</span>
                <span className="text-white font-mono">Tapsell Plus SDK</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>{settings.language === "fa" ? "پرداخت درون‌برنامه‌ای:" : "Billing:"}</span>
                <span className="text-white font-mono">Cafe Bazaar IAB</span>
              </div>
            </div>
          </div>

          <button
            id="btn-inspect-android-code"
            onClick={() => onSelectScreen("android-code")}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>{t.nav.androidCode}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
