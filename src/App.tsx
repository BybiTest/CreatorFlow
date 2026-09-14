import React, { useState, useEffect } from "react";
import { ScreenType, UserSettings, ContentIdea, PlannedContent } from "./types";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { AIAssistant } from "./components/AIAssistant";
import { ContentIdeas } from "./components/ContentIdeas";
import { HookScriptStudio } from "./components/HookScriptStudio";
import { ThumbnailStudio } from "./components/ThumbnailStudio";
import { StoryStudio } from "./components/StoryStudio";
import { YouTubeGrowth } from "./components/YouTubeGrowth";
import { CreatorPlanner } from "./components/CreatorPlanner";
import { SettingsModal } from "./components/SettingsModal";
import { AndroidProjectExporter } from "./components/AndroidProjectExporter";
import { VIPPaywall } from "./components/VIPPaywall";
import { TapsellAdModal } from "./components/TapsellAdModal";

export default function App() {
  // Application State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("dashboard");
  const [isVIP, setIsVIP] = useState<boolean>(() => {
    return localStorage.getItem("creatorflow_is_vip") === "true";
  });
  const [aiTokens, setAiTokens] = useState<number>(() => {
    const saved = localStorage.getItem("creatorflow_ai_tokens");
    return saved !== null ? Number(saved) : 10;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("creatorflow_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      language: "fa",
      theme: "dark",
      textSize: "md",
      isVIP: false,
    };
  });

  const [savedIdeas, setSavedIdeas] = useState<ContentIdea[]>(() => {
    const saved = localStorage.getItem("creatorflow_saved_ideas");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [plannedContent, setPlannedContent] = useState<PlannedContent[]>(() => {
    const saved = localStorage.getItem("creatorflow_planned_content");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "plan-1",
        title: "بررسی اختصاصی و مقایسه آیفون ۱۶ پرومکس و S25 اولترا",
        format: "Long-form",
        stage: "scripting",
      },
      {
        id: "plan-2",
        title: "۳ تریک افزایش واچ تایم یوتیوب در سال ۲۰۲۶",
        format: "Shorts",
        stage: "recording",
      },
      {
        id: "plan-3",
        title: "راز درآمدهای دلاری یوتیوبرهای ایرانی",
        format: "Long-form",
        stage: "editing",
      },
    ];
  });

  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem("creatorflow_settings", JSON.stringify(settings));
    document.documentElement.dir = settings.language === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = settings.language;
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("creatorflow_is_vip", String(isVIP));
  }, [isVIP]);

  useEffect(() => {
    localStorage.setItem("creatorflow_ai_tokens", String(aiTokens));
  }, [aiTokens]);

  useEffect(() => {
    localStorage.setItem("creatorflow_saved_ideas", JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  useEffect(() => {
    localStorage.setItem("creatorflow_planned_content", JSON.stringify(plannedContent));
  }, [plannedContent]);

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleVIPActivated = () => {
    setIsVIP(true);
    setSettings((prev) => ({ ...prev, isVIP: true }));
  };

  const handleRewardGranted = (tokens: number) => {
    setAiTokens((prev) => prev + tokens);
  };

  const getTextSizeClass = () => {
    switch (settings.textSize) {
      case "sm":
        return "text-xs sm:text-sm";
      case "lg":
        return "text-base sm:text-lg";
      case "xl":
        return "text-lg sm:text-xl";
      default:
        return "text-sm sm:text-base";
    }
  };

  return (
    <div
      id="creatorflow-root"
      dir={settings.language === "fa" ? "rtl" : "ltr"}
      className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans transition-colors selection:bg-purple-600 selection:text-white ${getTextSizeClass()}`}
    >
      {/* Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        onNavigate={setCurrentScreen}
        settings={settings}
        isVIP={isVIP}
        aiTokens={aiTokens}
        onOpenVIP={() => setCurrentScreen("vip")}
        onOpenTapsellAd={() => setIsAdModalOpen(true)}
        onOpenAdModal={() => setIsAdModalOpen(true)}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentScreen === "dashboard" && (
          <Dashboard
            onSelectScreen={setCurrentScreen}
            onOpenTapsellAd={() => setIsAdModalOpen(true)}
            settings={settings}
            {...({
              onNavigate: setCurrentScreen,
              isVIP: isVIP,
              aiTokens: aiTokens,
            } as any)}
          />
        )}

        {(currentScreen === "ai_assistant" || (currentScreen as string) === "ai-assistant") && (
          <AIAssistant
            settings={settings}
            isVIP={isVIP}
            aiTokens={aiTokens}
            onConsumeToken={() => setAiTokens((prev) => Math.max(0, prev - 1))}
            onOpenPaywall={() => setCurrentScreen("vip")}
            onOpenAdModal={() => setIsAdModalOpen(true)}
          />
        )}

        {(currentScreen === "content_ideas" || (currentScreen as string) === "content-ideas") && (
          <ContentIdeas
            settings={settings}
            isVIP={isVIP}
            aiTokens={aiTokens}
            onConsumeToken={() => setAiTokens((prev) => Math.max(0, prev - 1))}
            savedIdeas={savedIdeas}
            onSaveIdea={(idea) => setSavedIdeas((prev) => [idea, ...prev])}
            onRemoveIdea={(id) => setSavedIdeas((prev) => prev.filter((i) => i.id !== id))}
            onOpenPaywall={() => setCurrentScreen("vip")}
            onOpenAdModal={() => setIsAdModalOpen(true)}
          />
        )}

        {(currentScreen === "hook_script" || (currentScreen as string) === "hooks-scripts") && (
          <HookScriptStudio
            settings={settings}
            isVIP={isVIP}
            aiTokens={aiTokens}
            onConsumeToken={() => setAiTokens((prev) => Math.max(0, prev - 1))}
            onOpenPaywall={() => setCurrentScreen("vip")}
            onOpenAdModal={() => setIsAdModalOpen(true)}
          />
        )}

        {(currentScreen === "thumbnail_studio" || (currentScreen as string) === "thumbnail-studio") && (
          <ThumbnailStudio settings={settings} />
        )}

        {(currentScreen === "story_studio" || (currentScreen as string) === "story-studio") && (
          <StoryStudio settings={settings} />
        )}

        {(currentScreen === "youtube_growth" || (currentScreen as string) === "growth-roadmap") && (
          <YouTubeGrowth settings={settings} />
        )}

        {currentScreen === "planner" && (
          <CreatorPlanner
            settings={settings}
            items={plannedContent}
            onUpdateItems={setPlannedContent}
          />
        )}

        {(currentScreen === "android_export" || (currentScreen as string) === "android-code") && (
          <AndroidProjectExporter settings={settings} />
        )}

        {currentScreen === "vip" && (
          <VIPPaywall
            settings={settings}
            isVIP={isVIP}
            onVIPActivated={handleVIPActivated}
            onOpenAdModal={() => setIsAdModalOpen(true)}
          />
        )}

        {currentScreen === "settings" && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Tapsell Rewarded Video Ad Modal */}
      <TapsellAdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onRewardGranted={handleRewardGranted}
        settings={settings}
      />
    </div>
  );
}
