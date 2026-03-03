export const ROUTER_MODE = import.meta.env.VITE_ROUTER_MODE === 'hash' ? 'hash' : 'browser';

export const isHashRouter = ROUTER_MODE === 'hash';

export function buildAppUrl(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  if (isHashRouter) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBaseUrl}#${cleanPath}`;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(cleanPath, `${window.location.origin}${normalizedBaseUrl}`).toString();
}
