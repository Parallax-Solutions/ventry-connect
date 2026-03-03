import axios from 'axios';

type ApiErrorPayload = {
  statusCode?: number;
  message?: string | string[];
  messages?: string[];
};

export class AppError extends Error {
  statusCode?: number;
  messages: string[];

  constructor(message: string, messages?: string[], statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.messages = messages?.length ? messages : [message];
  }
}

function normalizeMessages(payload: unknown, fallback: string): string[] {
  if (typeof payload === 'string' && payload.trim()) {
    return [payload.trim()];
  }

  if (Array.isArray(payload)) {
    return payload
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (payload && typeof payload === 'object') {
    const data = payload as ApiErrorPayload;
    if (Array.isArray(data.messages) && data.messages.length > 0) {
      return normalizeMessages(data.messages, fallback);
    }

    if (data.message) {
      return normalizeMessages(data.message, fallback);
    }
  }

  return [fallback];
}

export function normalizeApiError(error: unknown, fallback = 'Something went wrong'): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const messages = normalizeMessages(error.response?.data, fallback);
    return new AppError(messages[0], messages, error.response?.status);
  }

  if (error instanceof Error) {
    return new AppError(error.message || fallback, [error.message || fallback]);
  }

  return new AppError(fallback);
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  return normalizeApiError(error, fallback).message;
}

export function getErrorMessages(error: unknown, fallback = 'Something went wrong'): string[] {
  return normalizeApiError(error, fallback).messages;
}
