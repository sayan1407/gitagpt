import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square, Sparkles } from 'lucide-react';

interface InputBoxProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (messageText?: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const QUICK_CHIPS = [
  "How to deal with loneliness?",
  "What is the true meaning of Karma Yoga?",
  "How to overcome anxiety and overthinking?",
  "How to control a restless mind?"
];

export const InputBox: React.FC<InputBoxProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  disabled,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 pb-3 md:pb-5">
      {/* Quick Chips (if input is empty and not streaming) */}
      {!isStreaming && !input && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 mb-2 no-scrollbar scroll-smooth">
          <span className="text-[11px] font-medium text-amber-400/80 flex items-center gap-1 flex-shrink-0 mr-1 pl-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Seek:</span>
          </span>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSend(chip)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-neutral-900/60 hover:bg-amber-500/15 text-neutral-300 hover:text-amber-200 border border-neutral-700/50 hover:border-amber-500/30 transition-all flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative rounded-2xl bg-neutral-900/90 dark:bg-[#16181e]/90 border border-amber-500/25 focus-within:border-amber-400/60 shadow-lg shadow-black/30 transition-all">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isStreaming) {
              onStop();
            } else if (input.trim()) {
              onSend();
            }
          }}
          className="flex items-end gap-2 p-2.5 md:p-3"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask anything to the Bhagavad Gita... (Press Enter to send, Shift+Enter for newline)"
            className="flex-1 max-h-40 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none resize-none px-2 py-1 leading-relaxed"
          />

          {/* Action button: Send or Stop */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 transition-colors flex items-center justify-center flex-shrink-0"
              title="Stop generating"
            >
              <Square className="w-4 h-4 fill-amber-400" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center flex-shrink-0 ${
                input.trim() && !disabled
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
              }`}
              title="Send your reflection"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </form>
      </div>

      {/* Spiritual Disclaimer */}
      <p className="text-[11px] text-center text-neutral-400 mt-2 px-2">
        GitaGPT offers philosophical guidance from the teachings of the Bhagavad Gita. Reflect with self-awareness and equanimity.
      </p>
    </div>
  );
};
