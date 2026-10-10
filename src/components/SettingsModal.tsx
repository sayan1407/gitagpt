import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertTriangle, RefreshCw /*, RotateCcw, Info, Tag */ } from 'lucide-react';
import { DEFAULT_API_ENDPOINT } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint: string;
  setApiEndpoint: (endpoint: string) => void;
  previousResponseId: string | null;
  onResetResponseId: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiEndpoint,
  setApiEndpoint,
  previousResponseId: _previousResponseId,
  onResetResponseId: _onResetResponseId,
}) => {
  const [tempEndpoint, setTempEndpoint] = useState(apiEndpoint);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiEndpoint(tempEndpoint.trim() || DEFAULT_API_ENDPOINT);
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const target = tempEndpoint.trim() || DEFAULT_API_ENDPOINT;

    try {
      // Test fetch with short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Pranam', previous_response_id: null }),
        signal: controller.signal,
      }).catch(async (directErr) => {
        // Fallback test via proxy
        if (target === DEFAULT_API_ENDPOINT || target.includes('127.0.0.1:8000')) {
          return await fetch('/api-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Pranam', previous_response_id: null }),
            signal: controller.signal,
          });
        }
        throw directErr;
      });

      clearTimeout(timeoutId);

      if (res && res.ok) {
        setTestResult({
          success: true,
          message: `Connected successfully! (Status: ${res.status} ${res.statusText})`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Endpoint returned HTTP ${res?.status || 'Unknown'}: ${res?.statusText || 'Error'}`,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: `Connection failed: ${errMsg}. Ensure http://127.0.0.1:8000/chat is running.`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#14161b] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-amber-500/20 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-semibold text-base text-amber-200">
              API & Session Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs md:text-sm">
          {/* Endpoint Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-neutral-300">
                Backend Chat Endpoint
              </label>
              <button
                type="button"
                onClick={() => setTempEndpoint(DEFAULT_API_ENDPOINT)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Reset to default
              </button>
            </div>
            <input
              type="text"
              value={tempEndpoint}
              onChange={(e) => setTempEndpoint(e.target.value)}
              placeholder="http://127.0.0.1:8000/chat"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/80 rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-neutral-400">
              Default: <code className="text-amber-300">{DEFAULT_API_ENDPOINT}</code>
            </p>
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Pinging endpoint...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Session State Inspection */}
          {/* <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Session Context Tracker</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-neutral-400">Previous Response ID:</span>
              <span className="font-mono text-amber-200 text-[11px] bg-neutral-800 px-2 py-0.5 rounded max-w-[210px] truncate">
                {previousResponseId || 'null (Fresh Session)'}
              </span>
            </div>
            {previousResponseId && (
              <button
                onClick={onResetResponseId}
                className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-rose-500/30"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Context ID to null</span>
              </button>
            )}
          </div> */}

          {/* Explanation note */}
          {/* <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2 text-neutral-400 text-[11px] leading-relaxed">
            <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Each time the GitaGPT service finishes streaming, it emits a <code className="text-amber-300 font-mono">response_id</code>. This is automatically preserved and sent as <code className="text-amber-300 font-mono">previous_response_id</code> for continuous dialogue. Starting a New Chat resets this to null.
            </span>
          </div> */}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-500/20 bg-neutral-900/70 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs transition-colors shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
