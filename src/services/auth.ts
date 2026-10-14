import type { GoogleAuthResponse, User } from '../types';

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const DEFAULT_AUTH_CALLBACK_ENDPOINT =
  import.meta.env.VITE_AUTH_CALLBACK_URL || 'https://gitagptapi.vercel.app/auth/google/callback';

export const PROXY_AUTH_CALLBACK_ENDPOINT = '/auth/google/callback';

export const STORAGE_KEY_USER = 'gitagpt_auth_user_v1';

/**
 * Calls the backend to store user info using the Google authorization code.
 * Endpoint: POST https://gitagptapi.vercel.app/auth/google/callback?code=<AUTH_CODE>
 */
export async function authenticateWithGoogleCode(
  code: string,
  customEndpoint?: string
): Promise<GoogleAuthResponse> {
  const baseEndpoint = (customEndpoint?.trim() || DEFAULT_AUTH_CALLBACK_ENDPOINT).trim();
  const url = `${baseEndpoint}?code=${encodeURIComponent(code)}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: unknown) {
    // If direct fetch to 127.0.0.1:8000 failed due to browser CORS restriction, try local Vite proxy
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (baseEndpoint.includes('127.0.0.1:8000') || baseEndpoint.includes('localhost:8000'));

    if (isNetworkOrCorsError) {
      console.warn('Direct fetch failed. Falling back to Vite proxy endpoint:', PROXY_AUTH_CALLBACK_ENDPOINT);
      const fallbackUrl = `${PROXY_AUTH_CALLBACK_ENDPOINT}?code=${encodeURIComponent(code)}`;
      response = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      throw err;
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
