import Config from 'react-native-config';
import { useEffect, useRef } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { generateState } from '../services/authService';
import { handleRedirect } from '../services/authService';

import {colors} from '../theme/colors';

export default function LoginScreen() {
    const expectedState = useRef<string>(generateState());
    useEffect(() => {
      const subscription = Linking.addEventListener('url', event => {
        handleRedirect(event.url, params);
      });

      return () => {
        subscription.remove();
      };
    }, []);

    const uid = Config.UID;
    if (!uid) {
      console.error("42 API uid is not configured");
      return;
    }

    const params = {
      client_id: uid,
      redirect_uri: 'swiftycompanion://oauth/callback',
      response_type: "code",
      scope: "public",
      state: expectedState.current
    };
    const queryString = new URLSearchParams(params).toString();
    const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?${queryString}`;

  const isDark = useColorScheme() !== 'light';
  const theme = isDark ? colors.dark : colors.light;

  const networkImage = isDark
    ? require('../assets/dark/darkGlobe2.png')
    : require('../assets/light/lightGlobe2.png');
  const logoImage = isDark
    ? require('../assets/dark/42dark.png')
    : require('../assets/light/42light.png');

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={logoImage}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={[styles.divider, {backgroundColor: theme.text}]} />

          <View style={styles.brand}>
            <Text style={[styles.brandTitle, {color: theme.text}]}>
              SWIFTY
            </Text>
            <Text style={[styles.brandSubtitle, {color: theme.secondaryText}]}>
              COMPANION
            </Text>
          </View>

          <Text style={[styles.version, {color: theme.primary}]}>
            v1.0
          </Text>
        </View>

        {/* Network section */}
        <View style={styles.networkSection}>
          <Text style={[styles.networkLabel, {color: theme.primary}]}>
            {'> GLOBAL NETWORK\n   ALL 42 CAMPUSES_'}
          </Text>

          <Image
            source={networkImage}
            style={styles.networkImage}
            resizeMode="contain"
          />
        </View>

        {/* Introduction */}
        <View style={styles.introduction}>
          <Text style={[styles.headline, {color: theme.text}]}>
            Your campus.
          </Text>
          <Text style={[styles.headline, {color: theme.secondary}]}>
            Your people.
          </Text>

          <Text style={[styles.description, {color: theme.secondaryText}]}>
            {'Explore student profiles, skills,\nprojects, and the 42 community.'}
          </Text>
        </View>

        {/* Login button */}
        <Pressable
          style={[styles.loginButton, {backgroundColor: theme.secondary}]}
          onPress={async () => {
            await Linking.openURL(authorizationUrl);
          }}>
          <Text style={styles.loginButtonText}>
            Continue with 42  →
          </Text>
        </Pressable>

        <Text style={[styles.loginHint, {color: theme.secondaryText}]}>
          SIGN IN WITH YOUR 42 ACCOUNT
        </Text>

        {/* Footer */}
        <Text style={[styles.footer, {color: theme.secondaryText}]}>
          42 NETWORK  //  GLOBAL COMMUNITY
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 55,
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 16,
  },
  brand: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontSize: 13,
    letterSpacing: 4,
  },
  version: {
    fontSize: 12,
  },
  networkSection: {
    marginTop: 15,

  },
  networkLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    lineHeight: 16,

  },
  networkImage: {
    width: '100%',
    height: 280,
    marginTop: -17,
  },
  introduction: {
    marginTop: 0,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 10,
  },
  loginButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loginButtonText: {
    color: '#080D0D',
    fontSize: 17,
    fontWeight: '700',
  },
  loginHint: {
    fontFamily: 'monospace',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 18,
    letterSpacing: 1,
  },
  footer: {
    fontFamily: 'monospace',
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 'auto',
    paddingTop: 48,
  },
});
