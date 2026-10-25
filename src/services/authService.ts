import 'react-native-get-random-values';

export function generateState(): string {
  const bytes = new Uint8Array(32);

  (globalThis as any).crypto.getRandomValues(bytes);

  return Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function handleRedirect(url: string, expectedState: string) {
  const parsedUrl = new URL(url);

  const code = parsedUrl.searchParams.get('code');
  const state = parsedUrl.searchParams.get('state');

  if (!code || !state || state !== expectedState) {
    console.error('Invalid redirect URL or state mismatch');
    return;
  }
  console.log('Code:', code);
  console.log('State:', state);
}

