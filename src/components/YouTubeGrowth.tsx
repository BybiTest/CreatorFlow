import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Users,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { UserSettings } from "../types";
import { translations } from "../translations";

interface YouTubeGrowthProps {
  settings: UserSettings;
}

export const YouTubeGrowth: React.FC<YouTubeGrowthProps> = ({ settings }) => {
  const t = translations[settings.language];
  const [subs, setSubs] = useState<number>(340);
  const [watchHours, setWatchHours] = useState<number>(1150);
  const [niche, setNiche] = useState("Tech & Education");

  // YouTube Partner Program (YPP) requirements
  const targetSubs = 1000;
  const targetHours = 4000;

  const subsPercentage = Math.min(100, Math.round((subs / targetSubs) * 100));
  const hoursPercentage = Math.min(100, Math.round((watchHours / targetHours) * 100));
  const overallReadiness = Math.round((subsPercentage + hoursPercentage) / 2);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.growth.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-400">{t.growth.subtitle}</p>
          </div>
        </div>

        {/* Input Parameters for Calculator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.growth.currentSubs}</span>
            </label>
            <input
              type="number"
              value={subs}
              onChange={(e) => setSubs(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.growth.watchHours}</span>
            </label>
            <input
              type="number"
              value={watchHours}
              onChange={(e) => setWatchHours(Math.max(0, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              حوزه فعالیت (Niche):
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Progress Cards to 1,000 Subs & 4,000 Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Subscribers Progress */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">سابسکرایبر</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{subsPercentage}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">{subs.toLocaleString()}</span>
            <span className="text-xs text-neutral-500 font-mono">/ 1,000</span>
          </div>
          <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${subsPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            {targetSubs - subs > 0
              ? `${(targetSubs - subs).toLocaleString()} سابسکرایبر تا تکمیل شرط اول`
              : "شرط سابسکرایبر با موفقیت پاس شد!"}
          </p>
        </div>

        {/* Watch Hours Progress */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">ساعت واچ‌تایم</span>
            <span className="text-xs font-mono font-bold text-blue-400">{hoursPercentage}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">
              {watchHours.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/ 4,000 h</span>
          </div>
          <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${hoursPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            {targetHours - watchHours > 0
              ? `${(targetHours - watchHours).toLocaleString()} ساعت واچ‌تایم دیگر مورد نیاز است`
              : "شرط واچ‌تایم با موفقیت پاس شد!"}
          </p>
        </div>

        {/* Overall Readiness Score */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-neutral-900/60 p-5 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300">شاخص آمادگی درآمدزایی</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{overallReadiness}%</div>
          <p className="text-[11px] text-neutral-300 leading-snug">
            {overallReadiness >= 100
              ? "کانال شما آماده ارسال درخواست به YouTube Studio (YPP) است."
              : "برنامه پیشنهادی هفتگی زیر را برای شتاب‌دهی واچ‌تایم دنبال کنید."}
          </p>
        </div>
      </div>

      {/* Strategic Roadmap Milestones */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t.growth.roadmapHeader}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                فاز اول
              </span>
              <span className="text-xs text-neutral-400 font-mono">۰ تا ۱۰۰۰ سابسکرایبر</span>
            </div>
            <h3 className="font-bold text-sm text-white">جذب هسته اصلی مخاطبان وفادار</h3>
            <ul className="text-xs text-neutral-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>تولید حداقل ۲ ویدیوی شورتس در هفته برای سابسکرایبرگیری سریع</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>تمرکز بر عناوین با جستجوی بالا (Search Intent)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>پاسخگویی به تمام نظرات کاربران در ساعات اول انتشار</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60">
                فاز دوم
              </span>
              <span className="text-xs text-neutral-400 font-mono">۴۰۰۰ ساعت واچ‌تایم</span>
            </div>
            <h3 className="font-bold text-sm text-white">افزایش میانگین ماندگاری (AVD)</h3>
            <ul className="text-xs text-neutral-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>تکنیک حلقه‌های باز (Open Loops) در ویدیوهای بلند ۱۰ دقیقه‌ای</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>ساخت پلی‌لیست‌های تخصصی و اتصال با End Screen</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>بهینه‌سازی مقدمه ویدیو و حذف کامل بخش‌های زاید</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                فاز سوم
              </span>
              <span className="text-xs text-neutral-400 font-mono">Partner Program</span>
            </div>
            <h3 className="font-bold text-sm text-white">تنوع‌بخشی به درآمد و اسپانسرشیپ</h3>
            <ul className="text-xs text-neutral-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>تنظیم بهینه تبلیغات Mid-roll روی ویدیوهای بالاتر از ۸ دقیقه</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>لینک‌های همکاری در فروش (Affiliate Marketing)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>فعال‌سازی عضویت کانال (Channel Memberships)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended Upload Cadence */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-950 border border-blue-700/40 text-blue-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{t.growth.weeklySchedule}</h3>
            <p className="text-xs text-neutral-400">
              {settings.language === "fa"
                ? "۱ ویدیوی بلند عمیق (شنبه‌ها) + ۲ ویدیوی شورتس در طول هفته برای سابسکرایبرگیری"
                : "1 Core Long-form Video (Saturday) + 2 Shorts throughout the week to drive subscribers"}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 whitespace-nowrap">
          برنامه استاندارد سال ۲۰۲۶
        </div>
      </div>
    </div>
  );
};
