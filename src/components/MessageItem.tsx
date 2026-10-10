import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  User, 
  AlertCircle, 
  RotateCcw,
  // Tag
} from 'lucide-react';
import type { Message } from '../types';

interface MessageItemProps {
  message: Message;
  isLastAssistant: boolean;
  onRetry?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLastAssistant,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any other speech
    const utterance = new SpeechSynthesisUtterance(message.content);
    // Meditative, calm pacing
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div
      className={`group w-full py-5 px-3 md:px-6 transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-neutral-900/40 dark:bg-[#14161b]/50 border-y border-amber-500/5'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-3.5 md:gap-5 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-600 flex items-center justify-center text-neutral-200 shadow-sm border border-neutral-600/40">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-[1.5px] shadow-md shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#181512] flex items-center justify-center text-amber-400 font-bold text-xs">
                  ॐ
                </div>
              </div>
              {message.isStreaming && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75" />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-xs text-neutral-300">
              {isUser ? 'You' : 'GitaGPT'}
            </span>
            {!isUser && (
              <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.2 rounded font-serif">
                Eternal Wisdom
              </span>
            )}
            <span className="text-[10px] text-neutral-400 ml-auto">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Text Content */}
          {message.error ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Connection Error</p>
                <p className="text-neutral-400">{message.content}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-md text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry Inquiry
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-200 leading-relaxed font-sans prose-gita overflow-x-auto break-words">
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => (
                        <strong className="text-amber-400 font-semibold inline-flex items-center gap-1">
                          {children}
                        </strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-amber-500/60 bg-amber-500/5 px-3 py-2 rounded-r-lg my-2 italic text-amber-200/90 font-serif">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-neutral-800 text-amber-300 text-xs px-1.5 py-0.5 rounded font-mono">
                          {children}
                        </code>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>

                  {/* Pulsing indicator while streaming */}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-amber-400 ml-1 translate-y-0.5 animate-pulse rounded-sm" />
                  )}
                </>
              )}
            </div>
          )}

          {/* Action Bar for Assistant */}
          {!isUser && !message.error && message.content && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-neutral-400">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>

              {/* Text to Speech */}
              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors ${
                  isSpeaking ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-400 hover:text-amber-300'
                }`}
                title={isSpeaking ? "Stop listening" : "Listen to wisdom"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-[11px] text-amber-400">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Listen</span>
                  </>
                )}
              </button>

              {/* Retry if last assistant message and not streaming */}
              {isLastAssistant && !message.isStreaming && onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-amber-300 transition-colors"
                  title="Regenerate this response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Regenerate</span>
                </button>
              )}

              {/* Response ID badge */}
              {/* {message.responseId && (
                <div 
                  className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400 bg-neutral-800/60 border border-neutral-700/40"
                  title={`Backend response_id: ${message.responseId} (carried over to subsequent queries)`}
                >
                  <Tag className="w-2.5 h-2.5 text-amber-400/80" />
                  <span className="text-amber-300/80">id:</span>
                  <span className="truncate max-w-[120px]">{message.responseId.slice(0, 14)}...</span>
                </div>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
