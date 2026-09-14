export type ScreenType =
  | "dashboard"
  | "ai-assistant"
  | "content-ideas"
  | "hooks-scripts"
  | "thumbnail-studio"
  | "story-studio"
  | "growth-roadmap"
  | "planner"
  | "vip"
  | "settings"
  | "android-code";

export type Language = "fa" | "en";
export type ThemeMode = "dark" | "light";
export type TextSize = "sm" | "md" | "lg" | "xl";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  concept: string;
  hook: string;
  targetFormat: "Shorts" | "Long-form";
  viralPotential: number;
  estimatedWatchTime: string;
  thumbnailConcept: string;
  tags: string[];
  saved?: boolean;
}

export interface ScriptPackage {
  titleOptions: string[];
  hooks: {
    type: string;
    script: string;
    visualCue: string;
  }[];
  retentionIntro: string;
  scriptSections: {
    sectionTitle: string;
    timestampEst: string;
    audioDialogue: string;
    visualBroll: string;
    retentionTactic: string;
  }[];
  callToAction: {
    midRollCTA: string;
    endScreenCTA: string;
  };
  seoDescription: string;
  seoKeywords: string[];
}

export interface PlannedContent {
  id: string;
  title: string;
  format: "Shorts" | "Long-form" | "Story";
  stage: "idea" | "scripting" | "recording" | "editing" | "ready" | "published";
  scheduledDate?: string;
  notes?: string;
}

export interface ThumbnailElement {
  id: string;
  type: "text" | "badge" | "shape";
  text?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize: number;
  color: string;
  bgColor?: string;
  fontFamily: string;
  isBold?: boolean;
  hasShadow?: boolean;
}

export interface ThumbnailTemplate {
  id: string;
  name: string;
  category: "Gaming" | "Tech" | "Finance" | "Lifestyle" | "Podcast" | "Education";
  bgGradient: string;
  elements: ThumbnailElement[];
}

export interface StoryTemplate {
  id: string;
  name: string;
  category: "New Video" | "Poll / Q&A" | "Behind The Scenes" | "Quote" | "Announcement";
  bgGradient: string;
  elements: ThumbnailElement[];
}

export interface VIPPlan {
  id: "monthly" | "yearly";
  name: string;
  price: string;
  duration: string;
  bazaarSku: string;
  isPopular?: boolean;
  features: string[];
}

export interface UserSettings {
  theme: ThemeMode;
  textSize: TextSize;
  language: Language;
  accentColor?: string;
  isVip?: boolean;
  isVIP?: boolean;
  vipExpiryDate?: string;
  freeGenerationsRemaining?: number;
  rewardedTokens?: number;
}
