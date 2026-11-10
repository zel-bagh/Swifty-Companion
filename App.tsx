import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useEffect, useState } from 'react';

export type AuthStatus = 'checking' | 'valid' | 'invalid';

export default function App() {
  const [auth , setAuth] = useState<AuthStatus>('checking');
  useEffect(() => {
      // async function checkAuth() {
      //     try {
      //         const token = await getStoredToken();

      //         if (token && isTokenValid(token)) {
      //             setAuth('valid');
      //         } else {
      //             setAuth('invalid');
      //         }
      //     } catch (error) {
      //         setAuth('invalid');
      //     }
      // }

      // checkAuth();
  }, []);
  return (
    <SafeAreaProvider>
      {auth === 'checking' ? ( <LoadingScreen />) 
      : auth === 'valid' ? ( <ProfileScreen />)
      :( <LoginScreen onLoginSuccess={() => setAuth('valid')} />)
      }
    </SafeAreaProvider>
  );
}