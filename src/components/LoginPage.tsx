import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound
} from 'lucide-react';
import { authenticateWithGoogleCode, setStoredUser } from '../services/auth';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToApp?: () => void;
  theme?: 'dark' | 'light';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToApp,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<User | null>(null);

  // Optional manual test state for dev/testing custom auth codes
  const [showManualCode, setShowManualCode] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleAuthCode = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Calls POST https://gitagptapi.vercel.app/auth/google/callback?code=<AUTH_CODE>
      const authData = await authenticateWithGoogleCode(code);
      const user: User = {
        username: authData.username,
        email: authData.email,
        isNewUser: authData.is_new_user,
      };

      setStoredUser(user);
      setSuccessUser(user);

      // Brief pause to show warm welcome before returning to app
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1000);
    } catch (err: unknown) {
      console.error('Google OAuth callback failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to authenticate with Google. Please verify the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (codeResponse) => {
      if (codeResponse?.code) {
        handleAuthCode(codeResponse.code);
      } else {
        setError('No authorization code received from Google.');
      }
    },
    onError: (errorResponse) => {
      console.error('Google Sign-In Error:', errorResponse);
      setError('Google Sign-In was cancelled or failed. Please try again.');
      setIsLoading(false);
    },
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleAuthCode(manualCode.trim());
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#14161a] via-[#101216] to-[#0a0c0e] text-neutral-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient spiritual glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        {onBackToApp ? (
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-amber-300 hover:bg-neutral-800/60 transition-colors"
            title="Back to GitaGPT"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to GitaGPT</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-amber-600/20">
              ॐ
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-amber-200 tracking-wide">
                GitaGPT
              </span>
              <p className="text-[10px] text-amber-300/60">
                Spiritual Companion
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Authentication Required</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-neutral-900/80 border border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all">
          
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-[2px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#181512] flex items-center justify-center text-amber-300 font-bold text-2xl">
                ॐ
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-400 font-heading">
              Sign in to GitaGPT
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              Continue your spiritual journey and preserve your dialogue with the wisdom of the Bhagavad Gita.
            </p>
          </div>

          {/* Success State */}
          {successUser && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-300">
                  Welcome, {successUser.username}!
                </p>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Signed in as {successUser.email}. Redirecting...
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-rose-200">Authentication Error</p>
                <p className="text-rose-300/80 text-[11px] mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Primary Action: Single 'sign in with google' Button */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setError(null);
                googleLogin();
              }}
              disabled={isLoading || Boolean(successUser)}
              className="w-full group relative flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-medium text-sm text-neutral-900 bg-white hover:bg-neutral-100 active:scale-[0.99] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
              aria-label="Sign in with Google"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                  <span className="text-neutral-800 font-medium">Signing in with Google...</span>
                </>
              ) : (
                <>
                  {/* Google 'G' Official Logo */}
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-semibold text-neutral-800 tracking-wide">
                    Sign in with Google
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Privacy & Security Note */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Secure OAuth 2.0 authentication</span>
          </div>

          {/* Discreet Developer Helper: Test with custom auth code */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowManualCode(prev => !prev)}
              type="button"
              className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors inline-flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>{showManualCode ? 'Hide direct code tester' : 'Developer code test'}</span>
            </button>

            {showManualCode && (
              <form onSubmit={handleManualSubmit} className="mt-3 text-left space-y-2 p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                <label className="text-[10px] text-neutral-400 block">
                  Auth code to test endpoint (<code className="text-amber-400">/auth/google/callback?code=...</code>):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter auth code..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !manualCode.trim()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium border border-amber-500/30 disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-2 text-[11px] text-neutral-500">
        <p>योगस्थः कुरु कर्माणि — Established in Yoga, perform your action.</p>
      </footer>
    </div>
  );
};
