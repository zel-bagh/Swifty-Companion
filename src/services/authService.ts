import 'react-native-get-random-values';
import Config from 'react-native-config';

export function generateState(): string {
  const bytes = new Uint8Array(32);

  (globalThis as any).crypto.getRandomValues(bytes);

  return Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function handleRedirect(url: string, params: any) {
  const parsedUrl = new URL(url);

  const code = parsedUrl.searchParams.get('code');
  const state = parsedUrl.searchParams.get('state');

  if (!code || !state || state !== params.state) {
    console.error('Invalid redirect URL or state mismatch');
    return;
  }
  const token = await exchangeCodeForToken(code, params);
}

async function exchangeCodeForToken(code: string, params: any): Promise<string | null> {
  const secret = Config.SECRET;
  if (!secret) {
    console.error("42 API secret is not configured");
    return null;
  }

  try {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              grant_type: 'authorization_code',
              client_id: params.client_id,
              client_secret: secret,
              code: code,
              redirect_uri: params.redirect_uri,
              state: params.state,
          }),
      });

      if (!response.ok) {
          console.error('Failed to obtain token:', response.status, response.statusText);
          return null;
      }

      return await response.json();
  } catch (error) {
      console.error('Error obtainingtoken:', error);
      return null;
  }
}