import type { GoogleAuthResponse, User } from '../types';

export const VITE_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const DEFAULT_AUTH_CALLBACK_ENDPOINT =
  import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL || 'https://gitagptapi.vercel.app/auth/google/callback';

export const PROXY_AUTH_CALLBACK_ENDPOINT = '/auth/google/callback';

export const STORAGE_KEY_USER = 'gitagpt_auth_user_v1';

/**
 * Calls the backend to store user info using the Google authorization code.
 * Sends authorization code securely in the POST JSON body (preventing query parameter leakage).
 */
export async function authenticateWithGoogleCode(
  code: string,
  customEndpoint?: string
): Promise<GoogleAuthResponse> {
  const baseEndpoint = (customEndpoint?.trim() || DEFAULT_AUTH_CALLBACK_ENDPOINT).trim();
  const payload = JSON.stringify({ code });

  let response: Response;

  try {
    response = await fetch(baseEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });
  } catch (err: unknown) {
    // If direct fetch failed due to browser CORS restriction, try local Vite proxy
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (baseEndpoint.includes('127.0.0.1:8000') ||
        baseEndpoint.includes('localhost:8000') ||
        baseEndpoint.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      console.warn('Direct fetch failed. Falling back to Vite proxy endpoint:', PROXY_AUTH_CALLBACK_ENDPOINT);
      response = await fetch(PROXY_AUTH_CALLBACK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
    } else {
      throw err;
    }
  }

  // Graceful fallback for older endpoints that strictly expect query parameters
  if (response.status === 405 || response.status === 422) {
    try {
      const fallbackUrl = `${baseEndpoint}?code=${encodeURIComponent(code)}`;
      response = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      // ignore
    }
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorData = await response.json();
      errorDetail = errorData?.detail || errorData?.message || '';
    } catch {
      errorDetail = await response.text().catch(() => '');
    }
    throw new Error(errorDetail || `Authentication failed (${response.status}: ${response.statusText})`);
  }

  return response.json();
}

/**
 * Returns Authorization header with Bearer token if user is authenticated.
 */
export function getAuthHeader(): Record<string, string> {
  const user = getStoredUser();
  if (user?.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.email === 'string') {
        return parsed as User;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored user from localStorage', e);
  }
  return null;
}

export function setStoredUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch (e) {
    console.error('Failed to clear stored user', e);
  }
}
