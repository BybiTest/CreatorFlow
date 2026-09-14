import React, { useState, useRef, useEffect } from "react";
import {
  Smartphone,
  Download,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Type,
  Tag,
} from "lucide-react";
import { StoryTemplate, ThumbnailElement, UserSettings } from "../types";
import { translations } from "../translations";

interface StoryStudioProps {
  settings: UserSettings;
}

export const StoryStudio: React.FC<StoryStudioProps> = ({ settings }) => {
  const t = translations[settings.language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultStoryTemplates: StoryTemplate[] = [
    {
      id: "story-new-video",
      name: settings.language === "fa" ? "انتشار ویدیوی جدید (New Video)" : "New Video Drop",
      category: "New Video",
      bgGradient: "linear-gradient(180deg, #18181b 0%, #3b0764 50%, #09090b 100%)",
      elements: [
        {
          id: "st-1",
          type: "badge",
          text: "ویدیوی جدید منتشر شد",
          x: 15,
          y: 20,
          fontSize: 36,
          color: "#ffffff",
          bgColor: "#dc2626",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "st-2",
          type: "text",
          text: settings.language === "fa" ? "رازهای الگوریتم یوتیوب" : "YOUTUBE GROWTH SECRETS",
          x: 10,
          y: 45,
          fontSize: 64,
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "st-3",
          type: "badge",
          text: "لینک در بیو",
          x: 25,
          y: 80,
          fontSize: 42,
          color: "#000000",
          bgColor: "#ffffff",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          isBold: true,
          hasShadow: true,
        },
      ],
    },
    {
      id: "story-poll",
      name: settings.language === "fa" ? "نظرسنجی و تعامل (Poll / Q&A)" : "Audience Poll",
      category: "Poll / Q&A",
      bgGradient: "linear-gradient(180deg, #022c22 0%, #064e3b 50%, #020617 100%)",
      elements: [
        {
          id: "sp-1",
          type: "badge",
          text: "POLL OF THE DAY",
          x: 20,
          y: 18,
          fontSize: 34,
          color: "#052e16",
          bgColor: "#4ade80",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "sp-2",
          type: "text",
          text: settings.language === "fa" ? "کدام قالب ویدیو را ترجیح می‌دهید؟" : "WHICH FORMAT DO YOU PREFER?",
          x: 10,
          y: 42,
          fontSize: 58,
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "sp-3",
          type: "text",
          text: settings.language === "fa" ? "۱. شورتس ۶۰ ثانیه‌ای\n۲. ویدیوی کامل ۱۲ دقیقه‌ای" : "1. 60-Sec Shorts\n2. 12-Min Deep Dive",
          x: 10,
          y: 65,
          fontSize: 42,
          color: "#a7f3d0",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: false,
          hasShadow: true,
        },
      ],
    },
  ];

  const [activeTemplate, setActiveTemplate] = useState<StoryTemplate>(defaultStoryTemplates[0]);
  const [elements, setElements] = useState<ThumbnailElement[]>(defaultStoryTemplates[0].elements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(elements[0]?.id || null);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Draw 9:16 Canvas (1080 x 1920)
  const drawStory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#09090b");
    grad.addColorStop(0.5, "#2e1065");
    grad.addColorStop(1, "#030712");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Instagram Story safe zones subtle guides
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 200, 960, 1520);

    // Glow Orb
    const radial = ctx.createRadialGradient(540, 960, 40, 540, 960, 600);
    radial.addColorStop(0, "rgba(168, 85, 247, 0.2)");
    radial.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1080, 1920);

    // Draw elements
    elements.forEach((el) => {
      const posX = (el.x / 100) * 1080;
      const posY = (el.y / 100) * 1920;

      ctx.save();
      ctx.font = `${el.isBold ? "800" : "600"} ${el.fontSize * 1.3}px ${el.fontFamily || "Plus Jakarta Sans, sans-serif"}`;

      if (el.type === "badge" && el.bgColor) {
        const lines = (el.text || "").split("\n");
        const textMetrics = ctx.measureText(lines[0] || "");
        const padX = 36;
        const padY = 20;
        const w = textMetrics.width + padX * 2;
        const h = el.fontSize * 1.3 + padY * 2;

        ctx.fillStyle = el.bgColor;
        if (el.hasShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 8;
        }

        const r = 24;
        ctx.beginPath();
        ctx.moveTo(posX + r, posY - (el.fontSize * 1.3) + 4);
        ctx.arcTo(posX + w, posY - (el.fontSize * 1.3) + 4, posX + w, posY + h - (el.fontSize * 1.3), r);
        ctx.arcTo(posX + w, posY + h - (el.fontSize * 1.3), posX, posY + h - (el.fontSize * 1.3), r);
        ctx.arcTo(posX, posY + h - (el.fontSize * 1.3), posX, posY - (el.fontSize * 1.3) + 4, r);
        ctx.arcTo(posX, posY - (el.fontSize * 1.3) + 4, posX + w, posY - (el.fontSize * 1.3) + 4, r);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.fillStyle = el.color;
        ctx.fillText(el.text || "", posX + padX, posY + padY / 2);
      } else {
        if (el.hasShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 26;
          ctx.shadowOffsetY = 8;
        }
        ctx.fillStyle = el.color;
        const lines = (el.text || "").split("\n");
        lines.forEach((line, lineIdx) => {
          ctx.fillText(line, posX, posY + lineIdx * (el.fontSize * 1.6));
        });
      }
      ctx.restore();
    });
  };

  useEffect(() => {
    drawStory();
  }, [elements]);

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `CreatorFlow-Story-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.stories.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-400">{t.stories.subtitle}</p>
          </div>
        </div>
        <button
          id="btn-export-story-png"
          onClick={handleExportPng}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>{t.stories.exportStory}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Story 9:16 Vertical Preview */}
        <div className="flex justify-center">
          <div className="w-[280px] sm:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-neutral-800 shadow-2xl bg-black">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Controls & Layers */}
        <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
          <h3 className="font-bold text-sm text-white">{t.stories.templates}</h3>
          <div className="grid grid-cols-1 gap-2">
            {defaultStoryTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  setActiveTemplate(template);
                  setElements(template.elements);
                  setSelectedElementId(template.elements[0]?.id || null);
                }}
                className={`p-3 rounded-xl border text-left rtl:text-right transition-colors ${
                  activeTemplate.id === template.id
                    ? "border-indigo-500 bg-indigo-950/20 text-white"
                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                }`}
              >
                <span className="font-bold text-xs block text-white">{template.name}</span>
                <span className="text-[10px] text-indigo-400">{template.category}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <h4 className="font-bold text-xs text-neutral-300">لایه‌های متن</h4>
            <div className="flex gap-2">
              {elements.map((el, idx) => (
                <button
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedElementId === el.id
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                  }`}
                >
                  Layer {idx + 1}
                </button>
              ))}
            </div>

            {selectedElement && (
              <div className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block text-neutral-400 mb-1">متن لایه:</label>
                  <textarea
                    rows={3}
                    value={selectedElement.text || ""}
                    onChange={(e) =>
                      setElements(
                        elements.map((el) =>
                          el.id === selectedElement.id ? { ...el, text: e.target.value } : el
                        )
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
