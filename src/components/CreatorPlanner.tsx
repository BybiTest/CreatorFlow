import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Video,
  FileText,
  Scissors,
  Check,
} from "lucide-react";
import { PlannedContent, UserSettings } from "../types";
import { translations } from "../translations";

interface CreatorPlannerProps {
  settings: UserSettings;
  items: PlannedContent[];
  onUpdateItems: (items: PlannedContent[]) => void;
}

export const CreatorPlanner: React.FC<CreatorPlannerProps> = ({
  settings,
  items,
  onUpdateItems,
}) => {
  const t = translations[settings.language];
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFormat, setNewFormat] = useState<"Shorts" | "Long-form" | "Story">("Long-form");

  const stages: {
    id: PlannedContent["stage"];
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    { id: "idea", label: t.planner.stages.idea, icon: <Clock className="w-4 h-4" />, color: "border-amber-500/40 text-amber-300 bg-amber-950/20" },
    { id: "scripting", label: t.planner.stages.scripting, icon: <FileText className="w-4 h-4" />, color: "border-cyan-500/40 text-cyan-300 bg-cyan-950/20" },
    { id: "recording", label: t.planner.stages.recording, icon: <Video className="w-4 h-4" />, color: "border-purple-500/40 text-purple-300 bg-purple-950/20" },
    { id: "editing", label: t.planner.stages.editing, icon: <Scissors className="w-4 h-4" />, color: "border-pink-500/40 text-pink-300 bg-pink-950/20" },
    { id: "ready", label: t.planner.stages.ready, icon: <Check className="w-4 h-4" />, color: "border-blue-500/40 text-blue-300 bg-blue-950/20" },
    { id: "published", label: t.planner.stages.published, icon: <CheckCircle2 className="w-4 h-4" />, color: "border-emerald-500/40 text-emerald-300 bg-emerald-950/20" },
  ];

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    const newItem: PlannedContent = {
      id: `plan-${Date.now()}`,
      title: newTitle.trim(),
      format: newFormat,
      stage: "idea",
    };
    onUpdateItems([...items, newItem]);
    setNewTitle("");
    setShowModal(false);
  };

  const handleMoveStage = (itemId: string, direction: "next" | "prev") => {
    const stageIds: PlannedContent["stage"][] = ["idea", "scripting", "recording", "editing", "ready", "published"];
    onUpdateItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const currentIndex = stageIds.indexOf(item.stage);
        const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < stageIds.length) {
          return { ...item, stage: stageIds[newIndex] };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    onUpdateItems(items.filter((i) => i.id !== itemId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.planner.title}</h1>
            <p className="text-xs sm:text-sm text-neutral-400">{t.planner.subtitle}</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{t.planner.newContent}</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageItems = items.filter((item) => item.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-4 space-y-3 min-w-[220px] flex flex-col"
            >
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${stage.color}`}>
                <div className="flex items-center gap-1.5">
                  {stage.icon}
                  <span>{stage.label}</span>
                </div>
                <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-neutral-950/60">
                  {stageItems.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[500px] no-scrollbar">
                {stageItems.length === 0 ? (
                  <div className="py-8 text-center text-neutral-600 text-xs italic">
                    موردی در این مرحله نیست
                  </div>
                ) : (
                  stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/70 space-y-2 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                          {item.format}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-white leading-snug">
                        {item.title}
                      </p>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                        <button
                          onClick={() => handleMoveStage(item.id, "prev")}
                          disabled={stage.id === "idea"}
                          className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                        <button
                          onClick={() => handleMoveStage(item.id, "next")}
                          disabled={stage.id === "published"}
                          className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20"
                        >
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Content Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
            <h3 className="font-bold text-base text-white">{t.planner.newContent}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1">عنوان محتوا:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثلاً: بررسی مک‌بوک M4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">فرمت محتوا:</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Long-form">Long-form (ویدیوی بلند)</option>
                  <option value="Shorts">Shorts (ویدیو شورتس)</option>
                  <option value="Story">Instagram Story (استوری)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newTitle.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50"
              >
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
