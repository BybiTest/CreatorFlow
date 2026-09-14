import React, { useState, useEffect } from "react";
import { Tv, X, CheckCircle2, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { UserSettings } from "../types";
import { translations } from "../translations";

interface TapsellAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: (tokens: number) => void;
  settings: UserSettings;
}

export const TapsellAdModal: React.FC<TapsellAdModalProps> = ({
  isOpen,
  onClose,
  onRewardGranted,
  settings,
}) => {
  const t = translations[settings.language];
  const [secondsRemaining, setSecondsRemaining] = useState(8);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(8);
      setIsCompleted(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          onRewardGranted(3);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-neutral-950 overflow-hidden shadow-2xl">
        {/* Ad Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                {t.tapsell.rewardTitle}
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono">
                Ad ID: 6aa84a381f07c00619f451f1
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isCompleted || window.confirm(t.tapsell.skipWarning)) {
                onClose();
              }
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video bg-neutral-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Animated Background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-purple-600/10 to-indigo-600/10 animate-pulse" />

          {isCompleted ? (
            <div className="relative z-10 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-white text-base">
                {t.tapsell.rewardSuccess}
              </h4>
              <p className="text-xs text-neutral-400">
                {settings.language === "fa"
                  ? "۳ توکن تولید رایگان به موجودی شما افزوده شد."
                  : "+3 free generation tokens credited to your account."}
              </p>
            </div>
          ) : (
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-500/60 bg-amber-950/40 flex items-center justify-center text-amber-400 text-xl font-black font-mono">
                {secondsRemaining}s
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{t.tapsell.watchingAd}</p>
                <p className="text-xs text-neutral-400 mt-1">{t.tapsell.skipWarning}</p>
              </div>
            </div>
          )}

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${((8 - secondsRemaining) / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Ad Footer */}
        <div className="p-4 bg-neutral-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tapsell Plus v2.1.8</span>
          </div>
          {isCompleted ? (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold"
            >
              {t.tapsell.close}
            </button>
          ) : (
            <span className="text-[11px] text-neutral-500">
              در حال پخش تبلیغ...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
