import * as Keychain from 'react-native-keychain';

export type AuthTokens = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
};

export async function saveTokens(tokens: AuthTokens): Promise<void> {
    await Keychain.setGenericPassword(
        'oauth',
        JSON.stringify(tokens),
        { service: 'swifty-companion-auth' }
    );
}