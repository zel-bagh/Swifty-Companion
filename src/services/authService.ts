import 'react-native-get-random-values';
import Config from 'react-native-config';
import { AuthTokens, getStoredToken, saveTokens } from './tokenStorageService';
import { ConnectionError } from '../Errors/AppError';

export function generateState(): string {
  const bytes = new Uint8Array(32);

  (globalThis as any).crypto.getRandomValues(bytes);

  return Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export async function handleRedirect(url: string, params: any, onLoginSuccess: () => void): Promise<void> {
  const parsedUrl = new URL(url);

  const code = parsedUrl.searchParams.get('code');
  const state = parsedUrl.searchParams.get('state');
  console.error('code: ', code, 'state: ', state);

  if (!code || !state || state !== params.state) {
    console.error('Invalid redirect URL or state mismatch');
    return;
  }
  const token:any = await exchangeCodeForToken(code, params);
  if (!token)
    return;
  console.error(token)
  try {
      await saveTokens({
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_in: token.expires_in,
        created_at: token.created_at,
      });
      onLoginSuccess();
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
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

export async function resolveAuthState( setAuth: React.Dispatch<React.SetStateAction<'checking' | 'valid' | 'invalid' | 'appError' | 'connectionError' >>
): Promise<void> {
            try {
              const token = await getStoredToken();  
              if (token && await validateToken(token)) {
                  setAuth('valid');
              } else {
                  setAuth('invalid');
              }
          } catch (error) {
            if (error instanceof ConnectionError) {
              setAuth('connectionError');
            } else {
              console.error('Application error:', error);
              setAuth('appError');
            }
          }
}

async function validateToken(token: AuthTokens): Promise<boolean> {
      const now = Math.floor(Date.now() / 1000);
      const tokenExpiry = token.created_at + token.expires_in;
      if (now <= tokenExpiry - 60)
        return true;
      const [uid, secret] = [Config.UID, Config.SECRET];
      if (!uid || !secret)
        throw new Error("42 API uid or secret is not configured");
        const body = JSON.stringify({
              grant_type: 'refresh_token',
              client_id: uid,
              client_secret: secret,
              refresh_token: token.refresh_token,
            });
        let response: Response;
        try {
          response = await fetch('https://api.intra.42.fr/oauth/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body,
          });
          if (!response.ok) // maybe later we can handle auth errors [clientId or clientSecret invalid] here in a different way, but for now we will just return false and let the user log in again
            return false;
  } catch (error) {
      throw new ConnectionError("Failed to connect to the server");
  }
        const newToken = await response.json(); // if this throws, the problem could also be from server, but for now we will just render the appError screen. 
        await saveTokens({
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
        expires_in: newToken.expires_in,
        created_at: newToken.created_at,
      });
      return true;
}