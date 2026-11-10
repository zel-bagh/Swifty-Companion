import * as Keychain from 'react-native-keychain';

export type AuthTokens = {
    access_token: string;
    expires_in: number;
    created_at: number;
    refresh_token: string;
};

export async function saveTokens(tokens: AuthTokens): Promise<void> {
    const result = await Keychain.setGenericPassword(
        'oauth',
        JSON.stringify(tokens),
        { service: 'swifty-companion-auth' }
    );

    if (!result) {
        throw new Error('Failed to save credentials to Keychain');
    }
}