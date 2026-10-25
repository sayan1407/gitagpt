import type { ChatSession, Message } from '../types';
import { DEFAULT_API_ENDPOINT } from './api';

export const PROXY_SESSIONS_ENDPOINT = '/sessions';

/**
 * Derives the base backend API URL from the chat endpoint.
 * e.g., 'https://gitagptapi.vercel.app/chat' -> 'https://gitagptapi.vercel.app'
 */
export function getBaseApiUrl(customEndpoint?: string): string {
  const endpoint = (customEndpoint?.trim() || DEFAULT_API_ENDPOINT).trim();
  // Strip trailing /chat or trailing slashes
  return endpoint.replace(/\/chat\/?$/i, '').replace(/\/+$/, '');
}

/**
 * Fetches all chat sessions and their messages for a specific user from the database.
 */
export async function fetchUserSessions(
  userEmail: string,
  customEndpoint?: string
): Promise<ChatSession[]> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions?user_email=${encodeURIComponent(userEmail)}`;

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      console.warn('Direct fetch failed. Falling back to Vite proxy for /sessions');
      response = await fetch(`${PROXY_SESSIONS_ENDPOINT}?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to load sessions: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (Array.isArray(data)) {
    return data as ChatSession[];
  }
  return [];
}

/**
 * Saves or updates a complete chat session with all its messages in the database.
 */
export async function saveSession(
  userEmail: string,
  session: ChatSession,
  customEndpoint?: string
): Promise<ChatSession> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions/${encodeURIComponent(session.id)}`;
  const payload = {
    user_email: userEmail,
    session,
  };

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      response = await fetch(`${PROXY_SESSIONS_ENDPOINT}/${encodeURIComponent(session.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to save session: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Appends or updates a single message in a session.
 */
export async function saveMessage(
  userEmail: string,
  sessionId: string,
  message: Message,
  customEndpoint?: string
): Promise<Message> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions/${encodeURIComponent(sessionId)}/messages`;
  const payload = {
    user_email: userEmail,
    message,
  };

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      response = await fetch(`${PROXY_SESSIONS_ENDPOINT}/${encodeURIComponent(sessionId)}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to save message: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Renames a chat session in the database.
 */
export async function updateSessionTitle(
  userEmail: string,
  sessionId: string,
  title: string,
  customEndpoint?: string
): Promise<void> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions/${encodeURIComponent(sessionId)}`;
  const payload = {
    user_email: userEmail,
    title,
  };

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      response = await fetch(`${PROXY_SESSIONS_ENDPOINT}/${encodeURIComponent(sessionId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to update session title: ${response.status} ${errorText}`);
  }
}

/**
 * Deletes a session and all its messages from the database.
 */
export async function deleteSession(
  userEmail: string,
  sessionId: string,
  customEndpoint?: string
): Promise<void> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions/${encodeURIComponent(sessionId)}?user_email=${encodeURIComponent(userEmail)}`;

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'DELETE',
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      response = await fetch(
        `${PROXY_SESSIONS_ENDPOINT}/${encodeURIComponent(sessionId)}?user_email=${encodeURIComponent(userEmail)}`,
        {
          method: 'DELETE',
        }
      );
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to delete session: ${response.status} ${errorText}`);
  }
}

/**
 * Clears all chat sessions for the user from the database.
 */
export async function clearAllSessions(
  userEmail: string,
  customEndpoint?: string
): Promise<void> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions?user_email=${encodeURIComponent(userEmail)}`;

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'DELETE',
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      response = await fetch(`${PROXY_SESSIONS_ENDPOINT}?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to clear all sessions: ${response.status} ${errorText}`);
  }
}

/**
 * Batch-syncs sessions to the database (used for migrating from localStorage).
 */
export async function syncLocalSessionsToDb(
  userEmail: string,
  sessions: ChatSession[],
  customEndpoint?: string
): Promise<ChatSession[]> {
  const baseUrl = getBaseApiUrl(customEndpoint);
  const targetUrl = `${baseUrl}/sessions/sync`;
  const payload = {
    user_email: userEmail,
    sessions,
  };

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const isNetworkOrCorsError =
      err instanceof TypeError &&
      (targetUrl.includes('127.0.0.1:8000') ||
        targetUrl.includes('localhost:8000') ||
        targetUrl.includes('gitagptapi.vercel.app'));

    if (isNetworkOrCorsError) {
      response = await fetch(`${PROXY_SESSIONS_ENDPOINT}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to sync sessions: ${response.status} ${errorText}`);
  }

  return response.json();
}
