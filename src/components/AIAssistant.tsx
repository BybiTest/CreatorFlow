import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Bot,
  User,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { ChatMessage, UserSettings } from "../types";
import { translations } from "../translations";

interface AIAssistantProps {
  settings: UserSettings;
  onDeductToken: () => boolean;
  onOpenTapsellAd: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  settings,
  onDeductToken,
  onOpenTapsellAd,
}) => {
  const t = translations[settings.language];
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("creatorflow_ai_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        content:
          settings.language === "fa"
            ? "سلام! من دستیار هوشمند CreatorFlow هستم. آماده‌ام تا جذاب‌ترین قلاب‌ها (Hooks)، سناریوهای با ریتم تند برای یوتیوب، ایده‌های کاور با کلیک بالا و نقشه راه مانیتایز کانال را برایتان بنویسم. امروز می‌خواهید روی چه موضوعی کار کنیم؟"
            : "Welcome to CreatorFlow AI! I am your dedicated YouTube growth strategist and script copywriter. I can generate high-retention hooks, full video scripts, high-CTR titles, Shorts frameworks, and monetization roadmaps. What topic are we tackling today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("creatorflow_ai_chat", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (userPrompt?: string) => {
    const messageToSend = userPrompt || input.trim();
    if (!messageToSend || loading) return;

    // Check token / VIP access
    if (!settings.isVip) {
      const hasToken = onDeductToken();
      if (!hasToken) {
        setError(
          settings.language === "fa"
            ? "اعتبار تولید رایگان شما به پایان رسیده است. برای دریافت توکن رایگان تبلیغ تپسل را تماشا کنید یا به VIP ارتقا دهید."
            : "You have used your free AI tokens. Please watch a Tapsell rewarded video or upgrade to VIP."
        );
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to reach AI server.");
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      setError(err.message || "Failed to generate AI response. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (window.confirm(settings.language === "fa" ? "آیا مایل به پاکسازی کل تاریخچه گفتگو هستید؟" : "Clear all chat history?")) {
      setMessages([]);
      localStorage.removeItem("creatorflow_ai_chat");
    }
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[580px] rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white">{t.ai.title}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-neutral-400">{t.ai.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              id="btn-ai-regenerate"
              onClick={handleRegenerate}
              disabled={loading}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors disabled:opacity-50"
              title={t.ai.regenerate}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          )}
          <button
            id="btn-ai-clear"
            onClick={handleClear}
            className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 border border-neutral-800 transition-colors"
            title={t.ai.clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-7 h-7" />
            </div>
            <p className="text-sm text-neutral-400 max-w-sm">{t.ai.emptyState}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-300 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-none shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedId === msg.id ? (
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
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 items-center text-purple-400 text-xs bg-neutral-900/60 p-3 rounded-xl border border-purple-900/30 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{t.ai.loadingText}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {!settings.isVip && (
              <button
                onClick={onOpenTapsellAd}
                className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 whitespace-nowrap"
              >
                {settings.language === "fa" ? "مشاهده تبلیغ" : "Watch Ad"}
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Topic Chips */}
      <div className="px-4 py-2 border-t border-neutral-900 bg-neutral-900/30 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-neutral-500 flex items-center gap-1 flex-shrink-0 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        </span>
        {t.ai.suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-purple-950/60 text-neutral-300 hover:text-purple-300 border border-neutral-800 hover:border-purple-700/50 transition-colors text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.ai.placeholder}
            disabled={loading}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            id="btn-ai-send"
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all disabled:opacity-50 disabled:hover:bg-purple-600 shadow-md shadow-purple-600/20"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
