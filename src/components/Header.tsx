import React from 'react';
import { 
  Menu, 
  Plus, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  // Settings as SettingsIcon,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onNewChat: () => void;
  onOpenChapters: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  previousResponseId: string | null;
  sessionTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  onNewChat,
  onOpenChapters,
  onOpenSettings: _onOpenSettings,
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
  previousResponseId: _previousResponseId,
  sessionTitle,
}) => {
  return (
    <header className="h-14 border-b border-amber-900/20 bg-neutral-900/60 dark:bg-[#121418]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-3 md:px-5 transition-colors">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-2 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors focus:outline-none"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-[1.5px] shadow-sm shadow-amber-500/20 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#181512] flex items-center justify-center text-amber-400 font-semibold text-xs">
              ॐ
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base md:text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-500 truncate">
                GitaGPT
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                Vedic AI
              </span>
            </div>
          </div>
        </div>

        {/* Truncated active chat title in larger screens */}
        {sessionTitle && sessionTitle !== 'New Conversation' && (
          <div className="hidden lg:flex items-center text-xs text-neutral-400 border-l border-neutral-700/60 pl-3 ml-2 truncate max-w-xs">
            <span className="truncate">{sessionTitle}</span>
          </div>
        )}
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Session Status Pill */}
        {/* <div 
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-neutral-800/80 border border-amber-500/15 text-neutral-300"
          title={previousResponseId ? `Previous Response ID: ${previousResponseId}` : 'New Session (no previous context)'}
        >
          <span className={`w-2 h-2 rounded-full ${previousResponseId ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-amber-200/90 font-mono text-[10px]">
            {previousResponseId ? `Active Context` : `New Session`}
          </span>
        </div> */}

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-sm"
          title="Start fresh conversation (resets previous_response_id)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* 18 Chapters Guide */}
        <button
          onClick={onOpenChapters}
          className="p-2 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          title="Explore 18 Chapters of Bhagavad Gita"
          aria-label="18 Chapters"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className="p-2 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          title={soundEnabled ? "Mute peaceful chimes" : "Enable peaceful meditation chime"}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          title={theme === 'dark' ? "Switch to Sandalwood Light mode" : "Switch to Dhyana Dark mode"}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Settings */}
        {/* <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          title="Backend & Endpoint Settings"
          aria-label="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button> */}
      </div>
    </header>
  );
};
