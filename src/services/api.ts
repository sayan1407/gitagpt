export interface StreamChatParams {
  message: string;
  previousResponseId: string | null;
  onChunk: (chunk: string) => void;
  onResponseId: (responseId: string) => void;
  signal?: AbortSignal;
  customEndpoint?: string;
}

export const DEFAULT_API_ENDPOINT = 'https://gitagptapi.vercel.app/chat';
export const PROXY_API_ENDPOINT = '/api-chat';

/**
 * Sends a message to the GitaGPT backend and streams the response chunks.
 * Automatically captures the `response_id` returned at the end of the stream.
 */
export async function streamChatMessage({
  message,
  previousResponseId,
  onChunk,
  onResponseId,
  signal,
  customEndpoint,
}: StreamChatParams): Promise<{ fullContent: string; responseId: string | null }> {
  const targetUrl = customEndpoint?.trim() || DEFAULT_API_ENDPOINT;
  const requestBody = {
    message,
    previous_response_id: previousResponseId,
  };

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal,
    });
  } catch (err: unknown) {
    // If direct fetch failed due to browser CORS restriction, try local Vite proxy
    const isNetworkOrCorsError = err instanceof TypeError && (
      targetUrl === DEFAULT_API_ENDPOINT || targetUrl.includes('127.0.0.1:8000') || targetUrl.includes('localhost:8000') || targetUrl.includes('gitagptapi.vercel.app')
    );

    if (isNetworkOrCorsError && !signal?.aborted) {
      console.warn('Direct fetch failed (likely CORS). Falling back to Vite proxy endpoint:', PROXY_API_ENDPOINT);
      response = await fetch(PROXY_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal,
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `API error ${response.status}: ${errorText || response.statusText || 'Failed to get response from GitaGPT service'}`
    );
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported or response body is empty');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullContent = '';
  let responseId: string | null = null;
  let lineBuffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      lineBuffer += chunkText;

      const lines = lineBuffer.split('\n');
      // Keep whatever is after the last newline in buffer (might be incomplete line)
      lineBuffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // Check for data: {"type": "chunk", "content": "..."}
        if (line.startsWith('data:')) {
          const jsonStr = line.slice(5).trim();
          try {
            const data = JSON.parse(jsonStr);
            if (data && typeof data.content === 'string') {
              fullContent += data.content;
              onChunk(data.content);
            }
          } catch {
            // In case raw text was sent after data:
            if (jsonStr) {
              fullContent += jsonStr;
              onChunk(jsonStr);
            }
          }
        } 
        // Check for response_id: resp_...
        else if (line.toLowerCase().startsWith('response_id:')) {
          const match = line.match(/^response_id:\s*([^\s\r\n]+)/i);
          if (match && match[1]) {
            responseId = match[1];
            onResponseId(match[1]);
          }
        }
      }
    }

    // Flush any remaining buffer line
    if (lineBuffer.trim()) {
      const line = lineBuffer.trim();
      if (line.startsWith('data:')) {
        const jsonStr = line.slice(5).trim();
        try {
          const data = JSON.parse(jsonStr);
          if (data && typeof data.content === 'string') {
            fullContent += data.content;
            onChunk(data.content);
          }
        } catch {
          // ignore
        }
      } else if (line.toLowerCase().startsWith('response_id:')) {
        const match = line.match(/^response_id:\s*([^\s\r\n]+)/i);
        if (match && match[1]) {
          responseId = match[1];
          onResponseId(match[1]);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { fullContent, responseId };
}
