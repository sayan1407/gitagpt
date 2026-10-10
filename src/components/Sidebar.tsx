import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  X, 
  Quote, 
  Edit3, 
  Check
} from 'lucide-react';
import type { ChatSession } from '../types';
import { DAILY_SHLOKAS } from '../constants/gitaData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  onOpenChapters: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAll,
  onOpenChapters,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [shlokaIndex] = useState(() => Math.floor(Math.random() * DAILY_SHLOKAS.length));
  const currentShloka = DAILY_SHLOKAS[shlokaIndex];

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-72 md:w-80 bg-[#14161a] dark:bg-[#101216] border-r border-amber-900/20 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
        } ${isOpen ? 'lg:flex' : 'lg:hidden'}`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-amber-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-600/20">
              ॐ
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-amber-200 tracking-wide">
                GitaGPT
              </h2>
              <p className="text-[11px] text-amber-300/60">
                Spiritual Companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm text-amber-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/10 active:scale-[0.99] transition-all"
          >
            <Plus className="w-4 h-4 text-amber-950 font-bold" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* 18 Chapters Quick Trigger */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              onOpenChapters();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-amber-200/80 hover:text-amber-200 bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/15 transition-all text-left"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">18 Chapters of Bhagavad Gita</span>
            <span className="ml-auto text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
              700 Verses
            </span>
          </button>
        </div>

        {/* Sessions / Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Recent Reflections</span>
            <span className="text-[10px] text-neutral-500">
              {sessions.length}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4 text-neutral-400 text-xs">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-30 text-amber-400" />
              <p>No previous conversations.</p>
              <p className="text-[11px] mt-1 text-neutral-400">Ask any question to begin your inquiry.</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30 font-medium'
                      : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-amber-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleSaveRename(session.id, e)}
                        className="flex items-center gap-1 w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleSaveRename(session.id)}
                          autoFocus
                          className="bg-neutral-900 border border-amber-500/40 rounded px-1.5 py-0.5 text-xs text-amber-200 focus:outline-none w-full"
                        />
                        <button
                          type="submit"
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 rounded text-neutral-400 hover:text-amber-300 hover:bg-neutral-700/50"
                        title="Rename conversation"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/50"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Daily Shloka Inspirational Card */}
        {currentShloka && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-950/20 to-neutral-900/60 border border-amber-500/20 text-neutral-300">
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400 mb-1">
              <span className="flex items-center gap-1">
                <Quote className="w-3 h-3 text-amber-400" />
                Verse {currentShloka.verse}
              </span>
              <span className="text-[10px] text-amber-300/70">Daily Shloka</span>
            </div>
            <p className="text-[11px] italic font-serif text-amber-100/90 line-clamp-2 leading-relaxed">
              "{currentShloka.translation}"
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
              {currentShloka.meaning}
            </p>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-amber-900/20 flex items-center justify-between text-xs text-neutral-400">
          {sessions.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 text-[11px] transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all chats</span>
            </button>
          )}

          <div className="ml-auto flex items-center gap-1 text-[11px] text-amber-400/80">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Tat Tvam Asi</span>
          </div>
        </div>
      </aside>
    </>
  );
};
