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
            throw new Error('Failed to save credentials');
        }
}

export async function getStoredToken(): Promise<AuthTokens | null> {
        const credentials = await Keychain.getGenericPassword({
            service: 'swifty-companion-auth',
        });

        if (!credentials) {
            return null;
        }

        return JSON.parse(credentials.password) as AuthTokens;
}