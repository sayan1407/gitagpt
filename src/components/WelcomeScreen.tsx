import React from 'react';
import { PROMPT_CATEGORIES } from '../constants/gitaData';
import { Sparkles, ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenChapters: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPrompt,
  onOpenChapters,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center text-center">
      {/* Sacred Emblem Hero */}
      <div className="relative mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-1 shadow-xl shadow-amber-500/25 flex items-center justify-center animate-pulse-soft">
          <div className="w-full h-full rounded-full bg-[#161412] flex items-center justify-center border border-amber-400/30">
            <span className="font-heading text-3xl md:text-4xl text-amber-300 font-bold drop-shadow">
              ॐ
            </span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 p-1.5 rounded-full shadow-lg">
          <Sparkles className="w-4 h-4 fill-amber-950" />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 mb-3">
        GitaGPT
      </h1>

      <p className="text-sm md:text-base text-amber-100/70 max-w-xl mb-4 leading-relaxed">
        Ask your dilemmas, life questions, or philosophical curiosities to the eternal wisdom of the Bhagavad Gita.
      </p>

      {/* Sacred Quote banner */}
      <div className="max-w-md mx-auto mb-8 px-4 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
        <span className="italic font-serif">"The mind is everything. What you think, you become."</span>
      </div>

      {/* Quick Explore Chapters Banner */}
      <div className="w-full max-w-2xl mb-8 p-3 rounded-2xl bg-neutral-900/60 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-200">The 18 Chapters Guide</h4>
            <p className="text-[11px] text-neutral-400">Discover Karma Yoga, Bhakti Yoga, Dhyana, and cosmic consciousness.</p>
          </div>
        </div>
        <button
          onClick={onOpenChapters}
          className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
        >
          <span>Explore Chapters</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Categorized Prompt Suggestions */}
      <div className="w-full max-w-3xl space-y-4 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Questions to Inquire</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PROMPT_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2.5">
                <span className="text-base">{cat.icon}</span>
                <span>{cat.category}</span>
              </div>
              <div className="space-y-1.5">
                {cat.prompts.slice(0, 2).map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => onSelectPrompt(prompt)}
                    className="w-full text-left p-2 rounded-xl text-xs text-neutral-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors flex items-center justify-between group/btn"
                  >
                    <span className="line-clamp-1">{prompt}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-500 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 transition-all flex-shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Pill */}
      <div className="mt-8 flex items-center gap-2 text-[11px] text-neutral-400">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-500/60" />
        <span>Context-aware Vedic inquiry with real-time wisdom streaming</span>
      </div>
    </div>
  );
};
