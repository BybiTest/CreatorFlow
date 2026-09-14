import React from "react";
import {
  Sparkles,
  Crown,
  Tv,
  Settings,
  Globe,
  Sun,
  Moon,
  FolderGit2,
  Menu,
  X,
  PlaySquare,
  Lightbulb,
  FileText,
  Image,
  Smartphone,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { ScreenType, UserSettings } from "../types";
import { translations } from "../translations";

interface NavbarProps {
  currentScreen: ScreenType;
  onSelectScreen?: (screen: ScreenType) => void;
  onNavigate?: (screen: ScreenType) => void;
  settings: UserSettings;
  isVIP?: boolean;
  aiTokens?: number;
  onOpenVIP?: () => void;
  onOpenAdModal?: () => void;
  onUpdateSettings?: (settings: Partial<UserSettings>) => void;
  onOpenTapsellAd?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onSelectScreen,
  onNavigate,
  settings,
  isVIP,
  aiTokens,
  onOpenVIP,
  onOpenAdModal,
  onUpdateSettings,
  onOpenTapsellAd,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = translations[settings.language];
  const isRtl = settings.language === "fa";

  const handleSelectScreen = (screen: ScreenType) => {
    if (typeof onSelectScreen === "function") {
      onSelectScreen(screen);
    } else if (typeof onNavigate === "function") {
      onNavigate(screen);
    }
  };

  const handleOpenVIP = () => {
    if (typeof onOpenVIP === "function") {
      onOpenVIP();
    } else {
      handleSelectScreen("vip");
    }
  };

  const handleOpenTapsell = () => {
    if (typeof onOpenTapsellAd === "function") {
      onOpenTapsellAd();
    } else if (typeof onOpenAdModal === "function") {
      onOpenAdModal();
    }
  };

  const handleUpdate = (updated: Partial<UserSettings>) => {
    if (typeof onUpdateSettings === "function") {
      onUpdateSettings(updated);
    }
  };

  const effectiveIsVIP = Boolean(isVIP || settings.isVIP || settings.isVip);

  const navItems: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: <PlaySquare className="w-4 h-4" /> },
    { id: "ai-assistant", label: t.nav.aiAssistant, icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: "content-ideas", label: t.nav.contentIdeas, icon: <Lightbulb className="w-4 h-4 text-amber-400" /> },
    { id: "hooks-scripts", label: t.nav.hooksScripts, icon: <FileText className="w-4 h-4 text-cyan-400" /> },
    { id: "thumbnail-studio", label: t.nav.thumbnailStudio, icon: <Image className="w-4 h-4 text-pink-400" /> },
    { id: "story-studio", label: t.nav.storyStudio, icon: <Smartphone className="w-4 h-4 text-indigo-400" /> },
    { id: "growth-roadmap", label: t.nav.growthRoadmap, icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
    { id: "planner", label: t.nav.planner, icon: <CalendarDays className="w-4 h-4 text-blue-400" /> },
    { id: "vip", label: t.nav.vip, icon: <Crown className="w-4 h-4 text-amber-400" /> },
    { id: "android-code", label: t.nav.androidCode, icon: <FolderGit2 className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand & Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleSelectScreen("dashboard")}
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-purple-500/40 shadow-lg shadow-purple-900/20 bg-neutral-900 flex items-center justify-center">
            <img
              src="/icon.png"
              alt="CreatorFlow Logo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="sr-only">CreatorFlow</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-neutral-100 to-purple-300 bg-clip-text text-transparent">
                CreatorFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              {settings.language === "fa" ? "پلتفرم تخصصی هوش مصنوعی رشد یوتیوب" : "AI YouTube & Creator Platform"}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Quick Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.slice(0, 7).map((item) => (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleSelectScreen(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentScreen === item.id
                  ? "bg-purple-950/70 text-purple-200 border border-purple-700/50 shadow-sm"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-900/60"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Tapsell Rewarded Video Button */}
          <button
            id="btn-tapsell-reward"
            onClick={handleOpenTapsell}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-colors shadow-sm"
            title="Watch Tapsell Ad to get free generation tokens"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap">
              {settings.language === "fa" ? "تبلیغ تپسل (+۳)" : "Tapsell Ad (+3)"}
            </span>
          </button>

          {/* VIP Status Button */}
          <button
            id="btn-nav-vip"
            onClick={handleOpenVIP}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              effectiveIsVIP
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 shadow-md shadow-amber-500/20"
                : "bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {effectiveIsVIP ? (settings.language === "fa" ? "عضو VIP" : "VIP Pro") : "VIP"}
            </span>
          </button>

          {/* Language Switch */}
          <button
            id="btn-nav-lang"
            onClick={() => handleUpdate({ language: settings.language === "fa" ? "en" : "fa" })}
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
            title={settings.language === "fa" ? "تغییر به انگلیسی" : "Switch to Persian"}
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Settings Screen */}
          <button
            id="btn-nav-settings"
            onClick={() => handleSelectScreen("settings")}
            className={`p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 border transition-colors ${
              currentScreen === "settings" ? "border-purple-600 bg-neutral-900 text-purple-300" : "border-neutral-800"
            }`}
            title={t.nav.settings}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  handleSelectScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                  currentScreen === item.id
                    ? "bg-purple-950/80 text-purple-200 border border-purple-700/60"
                    : "bg-neutral-900/60 text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                handleOpenTapsell();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2"
            >
              <Tv className="w-4 h-4" />
              <span>{settings.language === "fa" ? "مشاهده تبلیغ تپسل (+۳ توکن)" : "Watch Tapsell Ad (+3 Credits)"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
