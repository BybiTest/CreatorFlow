import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Download,
  Plus,
  Trash2,
  Type,
  Tag,
  Palette,
  Layers,
  Sparkles,
  Move,
} from "lucide-react";
import { ThumbnailElement, ThumbnailTemplate, UserSettings } from "../types";
import { translations } from "../translations";

interface ThumbnailStudioProps {
  settings: UserSettings;
}

export const ThumbnailStudio: React.FC<ThumbnailStudioProps> = ({ settings }) => {
  const t = translations[settings.language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultTemplates: ThumbnailTemplate[] = [
    {
      id: "tmpl-tech",
      name: settings.language === "fa" ? "بررسی تکنولوژی (Tech Review)" : "Tech & Innovation",
      category: "Tech",
      bgGradient: "linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #030712 100%)",
      elements: [
        {
          id: "el-1",
          type: "badge",
          text: "NEW",
          x: 10,
          y: 15,
          fontSize: 32,
          color: "#000000",
          bgColor: "#fbbf24",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "el-2",
          type: "text",
          text: settings.language === "fa" ? "اصلاً نخر!" : "DO NOT BUY!",
          x: 10,
          y: 40,
          fontSize: 64,
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "el-3",
          type: "text",
          text: settings.language === "fa" ? "قبل از دیدن این ویدیو" : "BEFORE WATCHING THIS",
          x: 10,
          y: 65,
          fontSize: 42,
          color: "#a855f7",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
      ],
    },
    {
      id: "tmpl-gaming",
      name: settings.language === "fa" ? "گیمینگ و استریم (Gaming)" : "Gaming Pro",
      category: "Gaming",
      bgGradient: "linear-gradient(135deg, #450a0a 0%, #18181b 50%, #022c22 100%)",
      elements: [
        {
          id: "el-g1",
          type: "badge",
          text: "100K HP",
          x: 12,
          y: 16,
          fontSize: 34,
          color: "#ffffff",
          bgColor: "#dc2626",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "el-g2",
          type: "text",
          text: settings.language === "fa" ? "رکورد جهان شکست" : "WORLD RECORD",
          x: 12,
          y: 42,
          fontSize: 68,
          color: "#facc15",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "el-g3",
          type: "text",
          text: settings.language === "fa" ? "در کمتر از ۲ دقیقه!" : "IN UNDER 2 MINS!",
          x: 12,
          y: 68,
          fontSize: 46,
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
      ],
    },
    {
      id: "tmpl-finance",
      name: settings.language === "fa" ? "کسب درآمد و مالی (Finance)" : "Wealth & Finance",
      category: "Finance",
      bgGradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #020617 100%)",
      elements: [
        {
          id: "el-f1",
          type: "badge",
          text: "+500%",
          x: 10,
          y: 15,
          fontSize: 36,
          color: "#052e16",
          bgColor: "#4ade80",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "el-f2",
          type: "text",
          text: settings.language === "fa" ? "درآمد ماهانه ۳۰ میلیون" : "$10,000 / MONTH",
          x: 10,
          y: 40,
          fontSize: 66,
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
        {
          id: "el-f3",
          type: "text",
          text: settings.language === "fa" ? "نقشه راه سال ۲۰۲۶" : "2026 BLUEPRINT",
          x: 10,
          y: 65,
          fontSize: 44,
          color: "#34d399",
          fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
          isBold: true,
          hasShadow: true,
        },
      ],
    },
  ];

  const [activeTemplate, setActiveTemplate] = useState<ThumbnailTemplate>(defaultTemplates[0]);
  const [elements, setElements] = useState<ThumbnailElement[]>(defaultTemplates[0].elements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(elements[0]?.id || null);
  const [bgGradient, setBgGradient] = useState<string>(defaultTemplates[0].bgGradient);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Render to 1280x720 Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1280x720 standard YouTube thumbnail
    canvas.width = 1280;
    canvas.height = 720;

    // Background
    if (bgGradient.includes("linear-gradient")) {
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      if (bgGradient.includes("#1e1b4b")) {
        grad.addColorStop(0, "#09090b");
        grad.addColorStop(0.5, "#1e1b4b");
        grad.addColorStop(1, "#030712");
      } else if (bgGradient.includes("#450a0a")) {
        grad.addColorStop(0, "#450a0a");
        grad.addColorStop(0.5, "#18181b");
        grad.addColorStop(1, "#022c22");
      } else if (bgGradient.includes("#064e3b")) {
        grad.addColorStop(0, "#022c22");
        grad.addColorStop(0.5, "#064e3b");
        grad.addColorStop(1, "#020617");
      } else {
        grad.addColorStop(0, "#0f172a");
        grad.addColorStop(1, "#020617");
      }
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = "#09090b";
    }
    ctx.fillRect(0, 0, 1280, 720);

    // Grid accent subtle lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }

    // Glow Orb
    const radial = ctx.createRadialGradient(900, 360, 50, 900, 360, 400);
    radial.addColorStop(0, "rgba(168, 85, 247, 0.25)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1280, 720);

    // Draw Elements
    elements.forEach((el) => {
      const posX = (el.x / 100) * 1280;
      const posY = (el.y / 100) * 720;

      ctx.save();
      ctx.font = `${el.isBold ? "800" : "600"} ${el.fontSize}px ${el.fontFamily || "Plus Jakarta Sans, sans-serif"}`;

      if (el.type === "badge" && el.bgColor) {
        const textMetrics = ctx.measureText(el.text || "");
        const padX = 24;
        const padY = 14;
        const w = textMetrics.width + padX * 2;
        const h = el.fontSize + padY * 2;

        ctx.fillStyle = el.bgColor;
        if (el.hasShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 8;
        }

        // Rounded rect for badge
        const r = 12;
        ctx.beginPath();
        ctx.moveTo(posX + r, posY - el.fontSize + 4);
        ctx.arcTo(posX + w, posY - el.fontSize + 4, posX + w, posY + h - el.fontSize, r);
        ctx.arcTo(posX + w, posY + h - el.fontSize, posX, posY + h - el.fontSize, r);
        ctx.arcTo(posX, posY + h - el.fontSize, posX, posY - el.fontSize + 4, r);
        ctx.arcTo(posX, posY - el.fontSize + 4, posX + w, posY - el.fontSize + 4, r);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.fillStyle = el.color;
        ctx.fillText(el.text || "", posX + padX, posY + padY / 2);
      } else {
        if (el.hasShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
          ctx.shadowBlur = 24;
          ctx.shadowOffsetX = 4;
          ctx.shadowOffsetY = 6;
        }
        ctx.fillStyle = el.color;
        ctx.fillText(el.text || "", posX, posY);
      }
      ctx.restore();
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [elements, bgGradient]);

  const handleSelectTemplate = (template: ThumbnailTemplate) => {
    setActiveTemplate(template);
    setBgGradient(template.bgGradient);
    setElements(template.elements);
    setSelectedElementId(template.elements[0]?.id || null);
  };

  const handleAddTextLayer = () => {
    const newEl: ThumbnailElement = {
      id: `text-${Date.now()}`,
      type: "text",
      text: settings.language === "fa" ? "عنوان برجسته کاور" : "BOLD NEW HEADLINE",
      x: 15,
      y: 50,
      fontSize: 54,
      color: "#ffffff",
      fontFamily: "Plus Jakarta Sans, Vazirmatn, sans-serif",
      isBold: true,
      hasShadow: true,
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const handleAddBadge = () => {
    const newEl: ThumbnailElement = {
      id: `badge-${Date.now()}`,
      type: "badge",
      text: "VIRAL",
      x: 15,
      y: 20,
      fontSize: 32,
      color: "#000000",
      bgColor: "#e11d48",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      isBold: true,
      hasShadow: true,
    };
    setElements([...elements, newEl]);
    setSelectedElementId(newEl.id);
  };

  const updateSelectedElement = (updates: Partial<ThumbnailElement>) => {
    if (!selectedElementId) return;
    setElements(
      elements.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el))
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedElementId) return;
    setElements(elements.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `CreatorFlow-Thumbnail-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-950/70 border border-pink-500/40 text-pink-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.thumbnails.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-400">{t.thumbnails.subtitle}</p>
          </div>
        </div>
        <button
          id="btn-export-thumbnail-png"
          onClick={handleExportPng}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition-all self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>{t.thumbnails.exportPng}</span>
        </button>
      </div>

      {/* Templates Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {t.thumbnails.templates}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {defaultTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex items-center justify-between ${
                activeTemplate.id === template.id
                  ? "border-pink-500 bg-pink-950/20 text-white shadow-sm"
                  : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div>
                <p className="text-sm font-bold text-white">{template.name}</p>
                <span className="text-[10px] text-pink-400">{template.category}</span>
              </div>
              <Sparkles className="w-4 h-4 text-pink-400 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Editor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display (16:9 Aspect Ratio) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
          <p className="text-center text-xs text-neutral-500">{t.thumbnails.canvasTip}</p>
        </div>

        {/* Layer Controls & Properties */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span>{t.thumbnails.textProps}</span>
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddTextLayer}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs flex items-center gap-1 transition-colors"
                title={t.thumbnails.addText}
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleAddBadge}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs flex items-center gap-1 transition-colors"
                title={t.thumbnails.addBadge}
              >
                <Tag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Layer List Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {elements.map((el, i) => (
              <button
                key={el.id}
                onClick={() => setSelectedElementId(el.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedElementId === el.id
                    ? "bg-pink-600 text-white"
                    : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                }`}
              >
                <span>{el.type === "badge" ? "بج" : "متن"}</span>
                <span>Layer {i + 1}</span>
              </button>
            ))}
          </div>

          {selectedElement ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {t.thumbnails.textLabel}
                </label>
                <input
                  type="text"
                  value={selectedElement.text || ""}
                  onChange={(e) => updateSelectedElement({ text: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {t.thumbnails.fontSize} ({selectedElement.fontSize}px)
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="100"
                    value={selectedElement.fontSize}
                    onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                    className="w-full accent-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {t.thumbnails.textColor}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.color}
                      onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-neutral-400">{selectedElement.color}</span>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    موقعیت افقی X ({selectedElement.x}%)
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="80"
                    value={selectedElement.x}
                    onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                    className="w-full accent-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    موقعیت عمودی Y ({selectedElement.y}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={selectedElement.y}
                    onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              {selectedElement.type === "badge" && (
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    رنگ پس‌زمینه بج (Badge Color)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.bgColor || "#dc2626"}
                      onChange={(e) => updateSelectedElement({ bgColor: e.target.value })}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-neutral-400">
                      {selectedElement.bgColor || "#dc2626"}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedElement.hasShadow}
                    onChange={(e) => updateSelectedElement({ hasShadow: e.target.checked })}
                    className="rounded accent-pink-500"
                  />
                  <span>{t.thumbnails.layerShadow}</span>
                </label>

                <button
                  onClick={handleDeleteSelected}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                  title={t.thumbnails.deleteLayer}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 text-center py-6">
              یک لایه را برای ویرایش انتخاب کنید
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
