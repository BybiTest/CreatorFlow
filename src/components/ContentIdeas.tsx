import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  Flame,
  Clock,
  Image as ImageIcon,
  Tag,
  Plus,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ContentIdea, UserSettings } from "../types";
import { translations } from "../translations";

interface ContentIdeasProps {
  settings: UserSettings;
  onDeductToken: () => boolean;
  onOpenTapsellAd: () => void;
  onAddToPlanner: (idea: ContentIdea) => void;
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({
  settings,
  onDeductToken,
  onOpenTapsellAd,
  onAddToPlanner,
}) => {
  const t = translations[settings.language];
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState<"Shorts" | "Long-form" | "Both">("Both");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ideas, setIdeas] = useState<ContentIdea[]>(() => {
    const saved = localStorage.getItem("creatorflow_saved_ideas");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "idea-default-1",
        title:
          settings.language === "fa"
            ? "۵ ابزار رایگان هوش مصنوعی که هر تولیدکننده ویدیو در سال ۲۰۲۶ نیاز دارد"
            : "5 Free AI Tools Every Video Creator Needs in 2026",
        concept:
          settings.language === "fa"
            ? "بررسی کاربردی و گام‌به‌گام ابزارهایی که زمان تدوین و ساخت کاور را به نصف کاهش می‌دهند."
            : "Review of high-leverage AI applications cutting video editing and thumbnail creation time by 50%.",
        hook:
          settings.language === "fa"
            ? "اگر هنوز برای تدوین یک ویدیو ۱۰ ساعت زمان می‌گذارید، این تکنیک ۶۰ ثانیه‌ای همه چیز را تغییر می‌دهد..."
            : "If you're still spending 10 hours editing a single video, this 60-second workflow changes everything...",
        targetFormat: "Long-form",
        viralPotential: 96,
        estimatedWatchTime: "10-14 mins",
        thumbnailConcept:
          settings.language === "fa"
            ? "صفحه دو نیمه: ادیتور خسته در برابر سرعت ۱۰ برابری با دکمه Play نئونی بنفش"
            : "Split screen: Frustrated editor vs. 10x faster AI workflow with bold purple glow badge",
        tags: ["AI Tools", "Video Editing", "Content Creation", "YouTube Growth", "Productivity"],
        saved: false,
      },
      {
        id: "idea-default-2",
        title:
          settings.language === "fa"
            ? "چرا ۹۰٪ یوتیوبرهای تازه‌کار بعد از ۱۰ ویدیو تسلیم می‌شوند (تله الگوریتم)"
            : "Why 90% of New YouTubers Quit After 10 Videos (The Trap)",
        concept:
          settings.language === "fa"
            ? "تحلیل تله‌های روانی افت بازدیدها و آموزش جدول زمان‌بندی واقع‌بینانه ۳۰ روزه."
            : "The psychological algorithm plateau and retention analytics trap, with a 30-day realistic cadence.",
        hook:
          settings.language === "fa"
            ? "بزرگترین دروغی که درباره الگوریتم یوتیوب به شما گفته‌اند این است که کیفیت همیشه بر کمیت برتری دارد..."
            : "The single biggest lie about the YouTube algorithm is that quality beats upload consistency early on...",
        targetFormat: "Shorts",
        viralPotential: 94,
        estimatedWatchTime: "55s",
        thumbnailConcept:
          settings.language === "fa"
            ? "نمودار ریزش قرمز با چهره شوکه‌شده و متن بولد: تسلیم نشو!"
            : "Red cliff drop analytics graph with dramatic facial expression and 'DON'T QUIT' text",
        tags: ["YouTube Strategy", "Mindset", "Beginner Mistakes", "Audience Retention"],
        saved: false,
      },
    ];
  });

  const handleGenerate = async () => {
    if (!settings.isVip) {
      const hasToken = onDeductToken();
      if (!hasToken) {
        setError(
          settings.language === "fa"
            ? "اعتبار رایگان به پایان رسیده است. تبلیغ تپسل را تماشا کنید یا اشتراک VIP تهیه نمایید."
            : "No tokens remaining. Watch a Tapsell rewarded video or unlock VIP."
        );
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: niche || "Creator Economy & Digital Media",
          targetAudience: audience || "Active creators and enthusiasts",
          format,
          language: settings.language,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate ideas.");
      }

      if (Array.isArray(data.ideas) && data.ideas.length > 0) {
        const formatted = data.ideas.map((item: any, idx: number) => ({
          id: `idea-${Date.now()}-${idx}`,
          title: item.title || "Video Idea",
          concept: item.concept || "",
          hook: item.hook || "",
          targetFormat: item.targetFormat || format,
          viralPotential: item.viralPotential || 92,
          estimatedWatchTime: item.estimatedWatchTime || "8 mins",
          thumbnailConcept: item.thumbnailConcept || "",
          tags: item.tags || [],
          saved: false,
        }));
        setIdeas(formatted);
        localStorage.setItem("creatorflow_saved_ideas", JSON.stringify(formatted));
      }
    } catch (err: any) {
      console.error("Generate Ideas Error:", err);
      setError(err.message || "Could not generate ideas. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (idea: ContentIdea) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === idea.id ? { ...item, saved: true } : item))
    );
    onAddToPlanner(idea);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.ideas.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-400">{t.ideas.subtitle}</p>
          </div>
        </div>

        {/* Filter / Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.ideas.nicheLabel}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder={t.ideas.nichePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.ideas.audienceLabel}
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder={t.ideas.audiencePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.ideas.formatLabel}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Both">{t.ideas.formatBoth}</option>
              <option value="Long-form">{t.ideas.formatLong}</option>
              <option value="Shorts">{t.ideas.formatShorts}</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="btn-generate-ideas"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.ideas.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.ideas.generateBtn}</span>
              </>
            )}
          </button>

          {!settings.isVip && (
            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
              <span>{settings.language === "fa" ? "توکن باقی‌مانده:" : "Remaining tokens:"}</span>
              <strong className="text-amber-400">{settings.freeGenerationsRemaining}</strong>
            </span>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {!settings.isVip && (
              <button
                onClick={onOpenTapsellAd}
                className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 text-xs whitespace-nowrap"
              >
                {settings.language === "fa" ? "مشاهده تبلیغ" : "Watch Ad"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 hover:border-neutral-700 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {idea.targetFormat}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{t.ideas.viralScore} {idea.viralPotential}%</span>
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{idea.estimatedWatchTime}</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                  {idea.title}
                </h3>
              </div>
              <button
                onClick={() => handleSave(idea)}
                disabled={idea.saved}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-start ${
                  idea.saved
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 cursor-default"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                }`}
              >
                {idea.saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.ideas.saved}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.ideas.saveToPlanner}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/60">
              {idea.concept}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                <span className="font-bold text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.ideas.hookPrompt}</span>
                </span>
                <p className="text-neutral-300 italic">"{idea.hook}"</p>
              </div>
              <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-500/20 space-y-1">
                <span className="font-bold text-pink-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{t.ideas.thumbConcept}</span>
                </span>
                <p className="text-neutral-300">{idea.thumbnailConcept}</p>
              </div>
            </div>

            {idea.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className="w-3 h-3 text-neutral-500" />
                {idea.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
