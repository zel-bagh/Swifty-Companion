import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useEffect, useState } from 'react';
import { resolveAuthState } from './src/services/authService';
import ErrorScreen from './src/screens/ErrorScreen';

export type AuthStatus = 'checking' | 'valid' | 'invalid' | 'appError' | 'connectionError';

export default function App() {
  const [auth , setAuth] = useState<AuthStatus>('checking'); // default to connectionError to show the error screen if the app fails to load
  useEffect(() => {
      resolveAuthState(setAuth);
  }, []);
  return (
    <SafeAreaProvider>
      {auth === 'checking' ? ( <LoadingScreen />)
      : auth === 'valid' ? ( <ProfileScreen />)
      : auth === 'appError' ? ( <ErrorScreen type="app" onRetry={() => {setAuth('checking'); resolveAuthState(setAuth);}} /> )
      : auth === 'connectionError' ? ( <ErrorScreen type="connection" onRetry={() => {setAuth('checking'); resolveAuthState(setAuth);}} /> )
      :( <LoginScreen onLoginSuccess={() => setAuth('valid')} />)
      }
    </SafeAreaProvider>
  );
}