import type { HandlerEvent } from '@netlify/functions';

export type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export function jsonResponse(statusCode: number, body: Json, headers: Record<string, string> = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

export function errorResponse(statusCode: number, message: string, details?: unknown) {
  return jsonResponse(statusCode, { error: message, details: details ?? undefined });
}

export async function readJson<T = any>(event: HandlerEvent): Promise<T> {
  if (!event.body) {
    throw new Error('Missing request body');
  }
  try {
    return JSON.parse(event.body) as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}


