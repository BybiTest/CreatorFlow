import React, { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Type,
  Globe,
  Trash2,
  Info,
  Check,
  User,
  Shield,
  Smartphone,
} from "lucide-react";
import { TextSize, ThemeMode, UserSettings } from "../types";
import { translations } from "../translations";

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const t = translations[settings.language];
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearData = () => {
    if (
      window.confirm(
        settings.language === "fa"
          ? "آیا از حذف تمام داده‌های محلی و گفتگوها اطمینان دارید؟"
          : "Are you sure you want to reset all stored creator data?"
      )
    ) {
      localStorage.removeItem("creatorflow_ai_chat");
      localStorage.removeItem("creatorflow_saved_ideas");
      localStorage.removeItem("creatorflow_planned_content");
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  const textSizes: { id: TextSize; label: string }[] = [
    { id: "sm", label: t.settings.sizes.sm },
    { id: "md", label: t.settings.sizes.md },
    { id: "lg", label: t.settings.sizes.lg },
    { id: "xl", label: t.settings.sizes.xl },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t.settings.title}</h1>
          <p className="text-xs sm:text-sm text-neutral-400">CreatorFlow Preferences & Info</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
        {/* Language Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>{t.settings.language}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ language: "fa" })}
              className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                settings.language === "fa"
                  ? "border-purple-500 bg-purple-950/40 text-white shadow-sm"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
              }`}
            >
              <span>🇮🇷</span>
              <span>فارسی (Persian)</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ language: "en" })}
              className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                settings.language === "en"
                  ? "border-purple-500 bg-purple-950/40 text-white shadow-sm"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
              }`}
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Text Size */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-400" />
            <span>{t.settings.textSize}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {textSizes.map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdateSettings({ textSize: s.id })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.textSize === s.id
                    ? "border-purple-500 bg-purple-950/40 text-white"
                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Mode */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>{t.settings.appearance}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ theme: "dark" })}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                settings.theme === "dark"
                  ? "border-purple-500 bg-purple-950/40 text-white"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400"
              }`}
            >
              <Moon className="w-4 h-4 text-purple-400" />
              <span>{t.settings.themeDark}</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: "light" })}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                settings.theme === "light"
                  ? "border-purple-500 bg-purple-950/40 text-white"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>{t.settings.themeLight}</span>
            </button>
          </div>
        </div>

        {/* Developer Info & About */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400" />
            <span>{t.settings.about}</span>
          </h3>
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-400">
              <span>{settings.language === "fa" ? "نام برنامه:" : "App Name:"}</span>
              <span className="text-white font-bold">CreatorFlow</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>{settings.language === "fa" ? "شناسه پکیج (Package ID):" : "Package ID:"}</span>
              <span className="text-purple-300 font-mono">com.creatorflow.app</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>{t.developerLabel}</span>
              <span className="text-amber-300 font-bold">{t.developerName}</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>نسخه انتشار (Release Version):</span>
              <span className="text-white font-mono">1.0.0 (Build 1)</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">{t.settings.aboutText}</p>
        </div>

        {/* Reset Local Storage */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-white">{t.settings.clearData}</h4>
            <p className="text-[11px] text-neutral-500">
              {settings.language === "fa"
                ? "پاکسازی تاریخچه چت و ویدیوهای برنامه‌ریزی‌شده"
                : "Reset saved chat history and planned items"}
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.settings.clearData}</span>
          </button>
        </div>

        {clearedNotice && (
          <p className="text-xs font-bold text-emerald-400 text-center">{t.settings.cleared}</p>
        )}
      </div>
    </div>
  );
};
