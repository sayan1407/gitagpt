import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InputBox } from './components/InputBox';
import { ChaptersModal } from './components/ChaptersModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginPage } from './components/LoginPage';
import type { ChatSession, Message, User } from './types';
import { streamChatMessage, DEFAULT_API_ENDPOINT } from './services/api';
import { playSereneChime } from './services/sound';
import { getStoredUser, clearStoredUser } from './services/auth';
import {
  fetchUserSessions,
  saveSession,
  updateSessionTitle,
  deleteSession,
  clearAllSessions,
  syncLocalSessionsToDb,
} from './services/chatHistory';

const STORAGE_KEY_SESSIONS = 'gitagpt_sessions_v1';
const STORAGE_KEY_ACTIVE_ID = 'gitagpt_active_session_id_v1';
const STORAGE_KEY_ENDPOINT = 'gitagpt_api_endpoint_v1';
const STORAGE_KEY_SOUND = 'gitagpt_sound_enabled_v1';
const STORAGE_KEY_THEME = 'gitagpt_theme_v1';

function createNewSession(): ChatSession {
  const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id,
    title: 'New Conversation',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    previousResponseId: null, // Initial session starts with null
    messages: [],
  };
}

export const App: React.FC = () => {
  // --- Persistent State ---
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load sessions from localStorage', e);
    }
    return [createNewSession()];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to load active session ID', e);
    }
    return sessions[0]?.id || '';
  });

  const [apiEndpoint, setApiEndpoint] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENDPOINT);
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to load API endpoint', e);
    }
    return DEFAULT_API_ENDPOINT;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load sound preference', e);
    }
    return true;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error('Failed to load theme preference', e);
    }
    return 'dark';
  });

  // --- User Authentication & Navigation State ---
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [currentView, setCurrentView] = useState<'chat' | 'login'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/login' || window.location.hash === '#login') {
        return 'login';
      }
    }
    return 'chat';
  });

  const navigateToLogin = useCallback(() => {
    setCurrentView('login');
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.history.pushState({ view: 'login' }, '', '/login');
    }
  }, []);

  const navigateToChat = useCallback(() => {
    setCurrentView('chat');
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      window.history.pushState({ view: 'chat' }, '', '/');
    }
  }, []);

  const handleLoginSuccess = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    navigateToChat();
  }, [navigateToChat]);

  const handleLogout = useCallback(() => {
    clearStoredUser();
    setUser(null);
    const fresh = createNewSession();
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    setCurrentView('login');
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.history.pushState({ view: 'login' }, '', '/login');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/login' || window.location.hash === '#login') {
          setCurrentView('login');
        } else {
          setCurrentView('chat');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- Runtime UI State ---
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Active session derived from database-backed sessions
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || createNewSession();

  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Load chat sessions from Neon database for the authenticated user
  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;
    setIsLoadingSessions(true);

    fetchUserSessions(user.email, apiEndpoint)
      .then(async (dbSessions) => {
        if (!isMounted) return;

        if (dbSessions && dbSessions.length > 0) {
          setSessions(dbSessions);
          setActiveSessionId((prevActive) => {
            const exists = dbSessions.some((s) => s.id === prevActive);
            return exists ? prevActive : dbSessions[0].id;
          });
          // Clear legacy localStorage sessions now that the database holds the history
          try {
            localStorage.removeItem(STORAGE_KEY_SESSIONS);
          } catch {
            // ignore
          }
        } else {
          // If database is empty, check if legacy localStorage sessions exist to migrate
          try {
            const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
            if (saved) {
              const parsed: ChatSession[] = JSON.parse(saved);
              const meaningfulSessions = parsed.filter(
                (s) => s.messages && s.messages.length > 0
              );
              if (meaningfulSessions.length > 0) {
                console.log('Migrating localStorage chat history to database...');
                const migrated = await syncLocalSessionsToDb(
                  user.email,
                  meaningfulSessions,
                  apiEndpoint
                );
                if (isMounted && migrated && migrated.length > 0) {
                  setSessions(migrated);
                  setActiveSessionId(migrated[0].id);
                  localStorage.removeItem(STORAGE_KEY_SESSIONS);
                  return;
                }
              }
            }
          } catch (migrErr) {
            console.error('Failed migrating local sessions to database:', migrErr);
          }

          if (isMounted) {
            const fresh = createNewSession();
            setSessions([fresh]);
            setActiveSessionId(fresh.id);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load chat sessions from database:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSessions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.email, apiEndpoint]);

  // Save active session ID to localStorage
  useEffect(() => {
    if (activeSessionId) {
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSessionId);
      } catch (e) {
        console.error('Failed to save activeSessionId', e);
      }
    }
  }, [activeSessionId]);

  // Save API endpoint to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENDPOINT, apiEndpoint);
    } catch (e) {
      console.error('Failed to save apiEndpoint', e);
    }
  }, [apiEndpoint]);

  // Save Sound preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundEnabled));
    } catch (e) {
      console.error('Failed to save soundEnabled', e);
    }
  }, [soundEnabled]);

  // Handle Theme class on body
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.className = 'bg-[#f8f5ee] text-[#2c2621] antialiased selection:bg-[#f59e0b]/30 selection:text-[#b45309]';
      } else {
        document.documentElement.classList.add('dark');
        document.body.className = 'bg-[#0f1115] text-[#ede8df] antialiased selection:bg-[#f59e0b]/30 selection:text-[#fbbf24]';
      }
    } catch (e) {
      console.error('Failed to apply theme', e);
    }
  }, [theme]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages.length, scrollToBottom]);

  // Start a brand New Chat (resets previous_response_id to null)
  const handleNewChat = useCallback(() => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }

    const newSession = createNewSession();
    // Ensure previousResponseId is strictly null for new chat sessions
    newSession.previousResponseId = null;

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput('');
  }, [isStreaming]);

  // Switch to a selected chat session
  const handleSelectSession = useCallback((id: string) => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    setActiveSessionId(id);
  }, [isStreaming]);

  // Delete a chat session
  const handleDeleteSession = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });

    if (user?.email) {
      deleteSession(user.email, id, apiEndpoint).catch(err => {
        console.error('Failed to delete session from database:', err);
      });
    }
  }, [activeSessionId, user?.email, apiEndpoint]);

  // Rename a chat session
  const handleRenameSession = useCallback((id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));

    if (user?.email) {
      updateSessionTitle(user.email, id, newTitle, apiEndpoint).catch(err => {
        console.error('Failed to update session title in database:', err);
      });
    }
  }, [user?.email, apiEndpoint]);

  // Clear all chats
  const handleClearAll = useCallback(() => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    const fresh = createNewSession();
    setSessions([fresh]);
    setActiveSessionId(fresh.id);

    if (user?.email) {
      clearAllSessions(user.email, apiEndpoint).catch(err => {
        console.error('Failed to clear sessions in database:', err);
      });
    }
  }, [isStreaming, user?.email, apiEndpoint]);

  // Reset context ID to null in the active session
  const handleResetResponseId = useCallback(() => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return { ...s, previousResponseId: null };
      }
      return s;
    }));
  }, [activeSession.id]);

  // Stop currently streaming generation
  const handleStopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    // Mark streaming messages as completed
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          messages: s.messages.map(m => m.isStreaming ? { ...m, isStreaming: false } : m),
        };
      }
      return s;
    }));
  }, [activeSession.id]);

  // Send message and stream the response
  const handleSendMessage = async (textToSend?: string) => {
    if (!user) {
      navigateToLogin();
      return;
    }

    const messageContent = (textToSend || input).trim();
    if (!messageContent || isStreaming) return;

    setInput('');

    // Prepare message IDs
    const userMessageId = `msg_user_${Date.now()}`;
    const assistantMessageId = `msg_asst_${Date.now()}`;

    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
    };

    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Update session title if first message
    const isFirstMessage = activeSession.messages.length === 0;
    const computedTitle = isFirstMessage 
      ? (messageContent.length > 38 ? messageContent.slice(0, 38) + '...' : messageContent)
      : activeSession.title;

    // Append both messages to the active session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          title: computedTitle,
          updatedAt: Date.now(),
          messages: [...s.messages, userMessage, initialAssistantMessage],
        };
      }
      return s;
    }));

    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let accumulatedContent = '';
    let capturedResponseId: string | null = null;

    try {
      // Execute streaming API call with previousResponseId from current session
      const result = await streamChatMessage({
        message: messageContent,
        previousResponseId: activeSession.previousResponseId, // Preserves previous_response_id in session
        onChunk: (chunk) => {
          accumulatedContent += chunk;
          setSessions(prev => prev.map(s => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                messages: s.messages.map(m => {
                  if (m.id === assistantMessageId) {
                    return { ...m, content: accumulatedContent };
                  }
                  return m;
                }),
              };
            }
            return s;
          }));
          scrollToBottom(true);
        },
        onResponseId: (newResponseId) => {
          capturedResponseId = newResponseId;
          // Store response_id in active session for subsequent requests!
          setSessions(prev => prev.map(s => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                previousResponseId: newResponseId,
                messages: s.messages.map(m => {
                  if (m.id === assistantMessageId) {
                    return { ...m, responseId: newResponseId };
                  }
                  return m;
                }),
              };
            }
            return s;
          }));
        },
        signal: abortController.signal,
        customEndpoint: apiEndpoint,
      });

      // Complete message state and persist to Neon database
      setSessions(prev => {
        let sessionToPersist: ChatSession | null = null;
        const updated = prev.map(s => {
          if (s.id === activeSession.id) {
            const finalId = capturedResponseId || result.responseId || s.previousResponseId;
            const updatedSession: ChatSession = {
              ...s,
              previousResponseId: finalId,
              updatedAt: Date.now(),
              messages: s.messages.map(m => {
                if (m.id === assistantMessageId) {
                  return {
                    ...m,
                    content: result.fullContent || accumulatedContent,
                    responseId: finalId || undefined,
                    isStreaming: false,
                  };
                }
                return m;
              }),
            };
            sessionToPersist = updatedSession;
            return updatedSession;
          }
          return s;
        });

        if (sessionToPersist && user?.email) {
          saveSession(user.email, sessionToPersist, apiEndpoint).catch(err => {
            console.error('Failed to save chat session to database:', err);
          });
        }

        return updated;
      });

      // Play peaceful chime if sound is enabled
      if (soundEnabled) {
        playSereneChime();
      }

    } catch (err: unknown) {
      if (abortController.signal.aborted) {
        console.log('Stream aborted by user');
      } else {
        console.error('Error during chat stream:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unable to connect to GitaGPT service.';

        setSessions(prev => {
          let errorSessionToPersist: ChatSession | null = null;
          const updated = prev.map(s => {
            if (s.id === activeSession.id) {
              const updatedSession: ChatSession = {
                ...s,
                updatedAt: Date.now(),
                messages: s.messages.map(m => {
                  if (m.id === assistantMessageId) {
                    return {
                      ...m,
                      content: `Could not retrieve wisdom: ${errorMessage}. Please check your backend connection at ${apiEndpoint}.`,
                      isStreaming: false,
                      error: true,
                    };
                  }
                  return m;
                }),
              };
              errorSessionToPersist = updatedSession;
              return updatedSession;
            }
            return s;
          });

          if (errorSessionToPersist && user?.email) {
            saveSession(user.email, errorSessionToPersist, apiEndpoint).catch(dbErr => {
              console.error('Failed to save session error to database:', dbErr);
            });
          }

          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Retry the last question
  const handleRetry = useCallback(() => {
    if (activeSession.messages.length === 0 || isStreaming) return;

    // Find the last user message
    const lastUserMessageIndex = [...activeSession.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMessageIndex === -1) return;

    const actualUserIndex = activeSession.messages.length - 1 - lastUserMessageIndex;
    const userMsgToRetry = activeSession.messages[actualUserIndex];

    // Remove the failing assistant message
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          messages: s.messages.slice(0, actualUserIndex),
        };
      }
      return s;
    }));

    // Re-send the query
    setTimeout(() => {
      handleSendMessage(userMsgToRetry.content);
    }, 100);
  }, [activeSession.messages, activeSession.id, isStreaming]);

  // Strict authentication guard: if user is not logged in, block all application operations
  if (!user || currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToApp={user ? navigateToChat : undefined}
        theme={theme}
      />
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === 'light' ? 'bg-[#fcfaf6] text-[#24211d]' : 'bg-[#0f1115] text-[#ede8df]'}`}>
      {/* Sidebar for chat sessions, chapters, and history */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAll={handleClearAll}
        onOpenChapters={() => setIsChaptersOpen(true)}
        user={user}
        onLoginClick={navigateToLogin}
        onLogout={handleLogout}
        isLoadingSessions={isLoadingSessions}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Navigation Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onNewChat={handleNewChat}
          onOpenChapters={() => setIsChaptersOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          theme={theme}
          setTheme={setTheme}
          previousResponseId={activeSession.previousResponseId}
          sessionTitle={activeSession.title}
          user={user}
          onLoginClick={navigateToLogin}
          onLogout={handleLogout}
        />

        {/* Message Stream or Welcome Screen */}
        <div className="flex-1 overflow-y-auto relative">
          {activeSession.messages.length === 0 ? (
            <WelcomeScreen
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onOpenChapters={() => setIsChaptersOpen(true)}
            />
          ) : (
            <div className="pb-8">
              {activeSession.messages.map((message, idx) => {
                const isLastAssistant = !message.isStreaming && message.role === 'assistant' && idx === activeSession.messages.length - 1;
                return (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isLastAssistant={isLastAssistant}
                    onRetry={handleRetry}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Bottom Input Area */}
        <div className="sticky bottom-0 z-10 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/95 to-transparent dark:from-[#0f1115] dark:via-[#0f1115]/95 dark:to-transparent pt-4">
          <InputBox
            input={input}
            setInput={setInput}
            onSend={(text) => handleSendMessage(text)}
            onStop={handleStopStreaming}
            isStreaming={isStreaming}
          />
        </div>
      </div>

      {/* 18 Chapters Modal */}
      <ChaptersModal
        isOpen={isChaptersOpen}
        onClose={() => setIsChaptersOpen(false)}
        onSelectQuestion={(question) => handleSendMessage(question)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiEndpoint={apiEndpoint}
        setApiEndpoint={setApiEndpoint}
        previousResponseId={activeSession.previousResponseId}
        onResetResponseId={handleResetResponseId}
      />
    </div>
  );
};

export default App;
