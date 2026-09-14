import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Video,
  Eye,
  Megaphone,
  Hash,
  Clock,
  Layers,
} from "lucide-react";
import { ScriptPackage, UserSettings } from "../types";
import { translations } from "../translations";

interface HookScriptStudioProps {
  settings: UserSettings;
  isVIP: boolean;
  aiTokens: number;
  onConsumeToken: () => void;
  onOpenPaywall: () => void;
  onOpenAdModal: () => void;
}

export const HookScriptStudio: React.FC<HookScriptStudioProps> = ({
  settings,
  isVIP,
  aiTokens,
  onConsumeToken,
  onOpenPaywall,
  onOpenAdModal,
}) => {
  const t = translations[settings.language];
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("Long-form (8-10 min)");
  const [tone, setTone] = useState("Engaging, High-Energy & Authoritative");
  const [ctaGoal, setCtaGoal] = useState("Subscribe + Watch Next Video");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [scriptPackage, setScriptPackage] = useState<ScriptPackage | null>(() => {
    return {
      titleOptions: [
        settings.language === "fa"
          ? "۵ اشتباه مرگبار که کانال شما را در سال ۲۰۲۶ نابود می‌کند"
          : "5 Fatal Mistakes Killing Your YouTube Channel in 2026 (And Fixes)",
        settings.language === "fa"
          ? "چرا هیچ‌کس ویدیوهای شما را تا آخر نمی‌بیند؟ (قانون ۳۰ ثانیه اول)"
          : "Why Nobody Watches Your Videos (The 30-Second Retention Rule)",
        settings.language === "fa"
          ? "چگونه در ۱۴ روز زمان تماشای کانال را ۳ برابر کردم"
          : "How I 3X'd My Audience Retention in 14 Days (Step-by-Step)",
      ],
      hooks: [
        {
          type: settings.language === "fa" ? "قلاب ادعای جسورانه (Bold Claim)" : "The Bold Claim Hook",
          script:
            settings.language === "fa"
              ? "اگر میانگین تماشای ویدیوی شما زیر ۴۰٪ است، الگوریتم یوتیوب به طور ریاضی انتشار ویدیوی شما را متوقف کرده است."
              : "If your average percentage viewed is under 40%, YouTube has mathematically given up on promoting your video.",
          visualCue:
            settings.language === "fa"
              ? "زوم سریع روی صورت همراه با افکت صوتی بم و گرافیک نمودار ریزش قرمز"
              : "Punch-in zoom on face with bass drop sound effect + red downward retention cliff overlay.",
        },
        {
          type: settings.language === "fa" ? "قلاب ایجاد شکاف کنجکاوی (Curiosity Gap)" : "The Curiosity Gap Hook",
          script:
            settings.language === "fa"
              ? "خیلی از کریتورها فکر می‌کنند مشکل از کاور است؛ اما دلیلی که باعث ترک مخاطب می‌شود دقیقاً در ثانیه ۱۷ رخ می‌دهد..."
              : "Most creators think their thumbnail is broken. But the exact reason your channel is flatlining happens at second 17...",
          visualCue:
            settings.language === "fa"
              ? "نگاه مستقیم به دوربین، یک ثانیه مکث کامل و صدای تیک‌تاک ساعت دیجیتال"
              : "Direct eye contact, 1-second silence, and animated digital stopwatch clicking down.",
        },
      ],
      retentionIntro:
        settings.language === "fa"
          ? "در این ویدیو قرار نیست نکات کلیشه‌ای بشنوید. ۵ نکته طلایی الگوریتم را همراه با مثال عملی باز می‌کنیم تا مخاطب حتی یک ثانیه را از دست ندهد."
          : "In this guide, we aren't talking generic advice. We are breaking down the 5 retention beats and exactly how to implement them to double your watch time.",
      scriptSections: [
        {
          sectionTitle:
            settings.language === "fa" ? "بخش اول: ۳۰ ثانیه طلایی اول" : "Section 1: The Golden 30 Seconds",
          timestampEst: "00:45",
          audioDialogue:
            settings.language === "fa"
              ? "بزرگترین اشتباه سلام و احوالپرسی طولانی یا پخش اینترو انیمیشنی است. فوراً قول عنوان را تایید کنید و اولین نکته شوکه‌کننده را ارائه دهید."
              : "The fatal trap is greeting viewers or running a long intro graphic. Immediately validate the title promise and deliver your first rapid-fire micro-win.",
          visualBroll:
            settings.language === "fa"
              ? "تصویر ضبط صفحه نمودار YouTube Studio همراه با فلش متحرک زرد"
              : "Screen capture of YouTube Studio retention graph with animated yellow callout arrow.",
          retentionTactic:
            settings.language === "fa"
              ? "تغییر زاویه دوربین هر ۶ ثانیه با افکت صوتی Swoosh"
              : "Camera angle cut every 6 seconds with subtle whoosh audio transition.",
        },
        {
          sectionTitle:
            settings.language === "fa" ? "بخش دوم: تکنیک حلقه‌های باز (Open Loops)" : "Section 2: The Open Loop Retention Hack",
          timestampEst: "03:15",
          audioDialogue:
            settings.language === "fa"
              ? "قبل از تمام شدن نکته دوم، نکته چهارم را پیش‌نمایش کنید تا مخاطب تا انتهای ویدیو کنجکاو بماند."
              : "Before concluding your second takeaway, preview tip number 4. By planting an open psychological loop, viewers refuse to click away.",
          visualBroll:
            settings.language === "fa"
              ? "زیرنویس گرافیکی تیره: نکته چهارم عامل اصلی افزایش درآمد کانال است"
              : "On-screen lower-third badge with 'Coming Up: The #1 RPM Multiplier'.",
          retentionTactic:
            settings.language === "fa" ? "انیمیشن متنی پاپ‌آپ با کنتراست بالا" : "High contrast kinetic typography pop",
        },
      ],
      callToAction: {
        midRollCTA:
          settings.language === "fa"
            ? "اگر همین یک نکته به رشد کانالتان کمک کرد، ویدیو را لایک کنید تا الگوریتم آن را به کریتورهای بیشتری نشان دهد."
            : "If this one insight just saved your channel, smash like so the algorithm routes this to more creators.",
        endScreenCTA:
          settings.language === "fa"
            ? "برای دیدن نحوه طراحی کاور با CTR بالای ۱۱٪ ویدیوی روی صفحه را لمس کنید."
            : "To learn how to pair this retention with an 11% CTR thumbnail, click the video right here on screen.",
      },
      seoDescription:
        settings.language === "fa"
          ? "راهنمای کامل مهندسی زمان تماشای ویدیو (Audience Retention) و واچ‌تایم یوتیوب در سال ۲۰۲۶.\n\nبخش‌های ویدیو:\n00:00 - مقدمه و اشتباه مرگبار\n00:45 - ۳۰ ثانیه طلایی اول\n03:15 - تکنیک حلقه‌های باز\n06:00 - جمع‌بندی و دعوت به اقدام\n\n#YouTubeGrowth #آموزش_یوتیوب #CreatorFlow"
          : "Complete guide to audience retention engineering and watch time growth for creators in 2026.\n\nChapters:\n00:00 - Introduction & The Fatal Mistake\n00:45 - The Golden 30 Seconds\n03:15 - Open Loop Technique\n06:00 - Summary & Call to Action\n\n#YouTubeGrowth #CreatorFlow",
      seoKeywords: [
        "YouTube Retention",
        "Audience Retention",
        "YouTube Algorithm 2026",
        "Watch Time Strategy",
        "CreatorFlow",
        "How to Grow on YouTube",
      ],
    };
  });

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    if (!isVIP && aiTokens <= 0) {
      setError(
        settings.language === "fa"
          ? "اعتبار تولید رایگان شما به پایان رسیده است. تبلیغ تپسل را تماشا کنید یا به VIP ارتقا دهید."
          : "You have no remaining generation tokens. Watch a Tapsell ad or upgrade to VIP."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          format,
          tone,
          callToAction: ctaGoal,
          language: settings.language,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate script.");
      }

      setScriptPackage(data);
    } catch (err: any) {
      console.error("Script Studio Error:", err);
      setError(err.message || "Failed to generate script package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(identifier);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyEntirePackage = () => {
    if (!scriptPackage) return;
    const fullText = `=== CREATORFLOW SCRIPT PACKAGE ===
TOPIC: ${topic || "YouTube Video"}

TITLES:
${scriptPackage.titleOptions.map((t, i) => `${i + 1}. ${t}`).join("\n")}

HOOKS:
${scriptPackage.hooks.map((h) => `[${h.type}]\nScript: ${h.script}\nVisual: ${h.visualCue}\n`).join("\n")}

INTRO (First 30s):
${scriptPackage.retentionIntro}

SCRIPT BREAKDOWN:
${scriptPackage.scriptSections
  .map(
    (s) =>
      `--- ${s.sectionTitle} (${s.timestampEst}) ---\nAudio: ${s.audioDialogue}\nB-Roll Visual: ${s.visualBroll}\nTactic: ${s.retentionTactic}\n`
  )
  .join("\n")}

CALL TO ACTION:
Mid-Roll: ${scriptPackage.callToAction.midRollCTA}
End-Screen: ${scriptPackage.callToAction.endScreenCTA}

SEO DESCRIPTION:
${scriptPackage.seoDescription}

TAGS: ${scriptPackage.seoKeywords.join(", ")}
`;
    copyText(fullText, "all");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header & Inputs */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.scripts.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-400">{t.scripts.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.scripts.topicLabel}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.scripts.topicPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.scripts.targetFormatLabel}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Long-form (8-10 min)">Long-form (8-10 min)</option>
              <option value="Shorts / Reels (60s)">Shorts / Reels (60s)</option>
              <option value="Deep-Dive Tutorial (15-20 min)">Deep-Dive Tutorial (15-20 min)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.scripts.ctaGoalLabel}
            </label>
            <input
              type="text"
              value={ctaGoal}
              onChange={(e) => setCtaGoal(e.target.value)}
              placeholder="Subscribe / Click link"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            id="btn-generate-script"
            onClick={handleGenerateScript}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.scripts.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.scripts.generateBtn}</span>
              </>
            )}
          </button>

          {scriptPackage && (
            <button
              onClick={copyEntirePackage}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors"
            >
              {copiedSection === "all" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">{t.ai.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.scripts.copyFull}</span>
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {!isVIP && (
              <button
                onClick={onOpenAdModal}
                className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 text-xs whitespace-nowrap"
              >
                {settings.language === "fa" ? "مشاهده تبلیغ" : "Watch Ad"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Generated Script Display */}
      {scriptPackage && (
        <div className="space-y-6">
          {/* Titles */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{t.scripts.titlesHeader}</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {scriptPackage.titleOptions.map((titleText, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3 group hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">
                    {idx + 1}. {titleText}
                  </span>
                  <button
                    onClick={() => copyText(titleText, `title-${idx}`)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    {copiedSection === `title-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hooks Selection */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
            <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{t.scripts.hooksHeader}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scriptPackage.hooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                      {hook.type}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-white italic leading-relaxed">
                      "{hook.script}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                    <div className="text-[11px] text-neutral-400 flex items-start gap-1.5">
                      <Video className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{hook.visualCue}</span>
                    </div>
                    <button
                      onClick={() => copyText(hook.script, `hook-${idx}`)}
                      className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 flex items-center justify-center gap-1 border border-neutral-800"
                    >
                      {copiedSection === `hook-${idx}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{t.ai.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t.ai.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intro Setup */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
            <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{t.scripts.introHeader}</span>
            </h3>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {scriptPackage.retentionIntro}
            </div>
          </div>

          {/* Body Sections */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
            <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>{t.scripts.bodyHeader}</span>
            </h3>
            <div className="space-y-3">
              {scriptPackage.scriptSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white text-sm">{sec.sectionTitle}</span>
                    <span className="font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      {sec.timestampEst}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans pt-1">
                    {sec.audioDialogue}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400">
                      <strong className="text-neutral-300">B-Roll Visual: </strong>
                      {sec.visualBroll}
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400">
                      <strong className="text-purple-300">Retention Tactic: </strong>
                      {sec.retentionTactic}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4" />
                <span>Mid-Roll CTA</span>
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 italic bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                "{scriptPackage.callToAction.midRollCTA}"
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4" />
                <span>End Screen Video Hook</span>
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 italic bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                "{scriptPackage.callToAction.endScreenCTA}"
              </p>
            </div>
          </div>

          {/* SEO Description & Tags */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span>{t.scripts.seoHeader}</span>
              </h3>
              <button
                onClick={() => copyText(scriptPackage.seoDescription, "seo-desc")}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 flex items-center gap-1"
              >
                {copiedSection === "seo-desc" ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{t.ai.copy}</span>
              </button>
            </div>
            <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-sans bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              {scriptPackage.seoDescription}
            </pre>
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {scriptPackage.seoKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-950 text-neutral-400 border border-neutral-800 font-mono"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
