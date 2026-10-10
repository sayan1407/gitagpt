import React, { useState } from 'react';
import { X, BookOpen, Search, ArrowRight, Sparkles } from 'lucide-react';
import { GITA_CHAPTERS } from '../constants/gitaData';

interface ChaptersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: string) => void;
}

export const ChaptersModal: React.FC<ChaptersModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredChapters = GITA_CHAPTERS.filter(ch => 
    ch.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `chapter ${ch.number}`.includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#14161b] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-amber-500/20 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-amber-950 font-bold shadow-md shadow-amber-500/20">
              <BookOpen className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-amber-200">
                The 18 Chapters of the Bhagavad Gita
              </h3>
              <p className="text-xs text-amber-400/70">
                Explore the paths of Karma, Bhakti, and Jnana Yoga (700 Verses)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 md:px-5 border-b border-neutral-800 bg-[#121418]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chapters by name, concept (e.g. Karma, Meditation, Duty, Devotion)..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/90 border border-neutral-700/60 rounded-xl text-xs md:text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Chapters Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter.number}
                className="p-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-amber-400 font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      Chapter {chapter.number}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {chapter.versesCount} Verses
                    </span>
                  </div>

                  <h4 className="font-heading font-semibold text-amber-200 text-sm md:text-base">
                    {chapter.sanskritName}
                  </h4>
                  <p className="text-xs text-neutral-400 font-serif italic mb-2">
                    {chapter.englishName}
                  </p>
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2 mb-3">
                    {chapter.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectQuestion(chapter.sampleQuestion);
                      onClose();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-amber-500/20"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="truncate">Ask about Chapter {chapter.number}</span>
                    <ArrowRight className="w-3 h-3 ml-auto flex-shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredChapters.length === 0 && (
            <div className="text-center py-12 text-neutral-400 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
              <p>No chapters matching "{searchTerm}".</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-amber-500/20 bg-neutral-900/70 flex items-center justify-between text-xs text-neutral-400">
          <span>Click any chapter inquiry to consult GitaGPT directly</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
