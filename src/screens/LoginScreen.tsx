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
  StatusBar,
  Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { generateState } from '../services/authService';
import { handleRedirect } from '../services/authService';
import {colors} from '../theme/colors';
import { Path, Svg, Circle } from 'react-native-svg';


export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const expectedState = useRef<string>(generateState());
    useEffect(() => {
      const subscription = Linking.addEventListener('url', event => {
        handleRedirect(event.url, params, onLoginSuccess);
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

  // const isDark = useColorScheme() !== 'light';
  // const theme = isDark ? colors.dark : colors.light;

  // const networkImage = isDark;
  //   ? require('../assets/dark/darkGlobe2.png')
  //   : require('../assets/light/lightGlobe2.png');
  // const logoImage = isDark
  //   ? require('../assets/dark/42dark.png')
  //   : require('../assets/light/42light.png');

  // return (
  //   <SafeAreaView
  //     edges={['top', 'bottom']}
  //     style={[styles.container, {backgroundColor: theme.background}]}>
  //     <ScrollView
  //       contentContainerStyle={styles.content}
  //       showsVerticalScrollIndicator={false}>

  //       {/* Header */}
  //       <View style={styles.header}>
  //         <Image
  //           source={logoImage}
  //           style={styles.logo}
  //           resizeMode="contain"
  //         />

  //         <View style={[styles.divider, {backgroundColor: theme.text}]} />

  //         <View style={styles.brand}>
  //           <Text style={[styles.brandTitle, {color: theme.text}]}>
  //             SWIFTY
  //           </Text>
  //           <Text style={[styles.brandSubtitle, {color: theme.secondaryText}]}>
  //             COMPANION
  //           </Text>
  //         </View>

  //         <Text style={[styles.version, {color: theme.primary}]}>
  //           v1.0
  //         </Text>
  //       </View>

  //       {/* Network section */}
  //       <View style={styles.networkSection}>
  //         <Text style={[styles.networkLabel, {color: theme.primary}]}>
  //           {'> GLOBAL NETWORK\n   ALL 42 CAMPUSES_'}
  //         </Text>

  //         <Image
  //           source={networkImage}
  //           style={styles.networkImage}
  //           resizeMode="contain"
  //         />
  //       </View>

  //       {/* Introduction */}
  //       <View style={styles.introduction}>
  //         <Text style={[styles.headline, {color: theme.text}]}>
  //           Your campus.
  //         </Text>
  //         <Text style={[styles.headline, {color: theme.secondary}]}>
  //           Your people.
  //         </Text>

  //         <Text style={[styles.description, {color: theme.secondaryText}]}>
  //           {'Explore student profiles, skills,\nprojects, and the 42 community.'}
  //         </Text>
  //       </View>

  //       {/* Login button */}
  //       <Pressable
  //         style={[styles.loginButton, {backgroundColor: theme.secondary}]}
  //         onPress={async () => {
  //           await Linking.openURL(authorizationUrl);
  //         }}>
  //         <Text style={styles.loginButtonText}>
  //           Continue with 42  →
  //         </Text>
  //       </Pressable>

  //       <Text style={[styles.loginHint, {color: theme.secondaryText}]}>
  //         SIGN IN WITH YOUR 42 ACCOUNT
  //       </Text>

  //       {/* Footer */}
  //       <Text style={[styles.footer, {color: theme.secondaryText}]}>
  //         42 NETWORK  //  GLOBAL COMMUNITY
  //       </Text>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
  return (
        <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative background */}
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Svg
          style={styles.topDecoration}
          width={200}
          height={200}
        >
          <Circle
            cx={0}
            cy={0}
            r={170}
            stroke="#DDDDDD"
            strokeWidth={1}
            fill="none"
          />
        </Svg>

        <Svg
          style={styles.bottomDecoration}
          width={200}
          height={200}
        >
          <Circle
            cx={200}
            cy={200}
            r={170}
            stroke="#DDDDDD"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* App branding */}
        <View style={styles.header}>
          <Svg width={36} height={30} viewBox="0 0 48 40">
            <Path
              d="M18 2H32L14 23L0 28Z"
              fill="#111111"
            />
            <Path
              d="M34 12H48L27 38H13Z"
              fill="#111111"
            />
          </Svg>

          <Text style={styles.appName}>
            Swifty Companion
          </Text>
        </View>

        <View style={styles.welcomeSection}>
          {/* Globe illustration */}
          <Image
            source={require('../assets/images/light/globe2.png')}
            style={styles.globe}
            resizeMode="contain"
          />

          {/* Welcome message */}
          <View style={styles.introduction}>
            <Text style={styles.title}>
              {'Your campus.\nYour people.'}
            </Text>

            <Text style={styles.description}>
              Stay connected with your 42 campus,
              your projects, and your community.
            </Text>
          </View>
        </View>

        {/* Authentication */}
        <View style={styles.authentication}>
          <Pressable
            onPress={async () => {
              // await Linking.openURL(authorizationUrl);
            }}
            // accessibilityRole="button"
            // accessibilityLabel="Continue with 42"
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Image
              source={require('../assets/images/light/1337-white.png')}
              style={styles.schoolLogo}
              resizeMode="contain"
            />

            <View style={styles.separator} />

            <Text style={styles.buttonText}>
              Continue with 42
            </Text>
          </Pressable>

          {/* Authentication footer */}
          <View style={styles.footer}>
            <Svg
              width={20}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
            >
              <Path
                d="M12 2L21 6V11C21 16 17 20 12 22C7 20 3 16 3 11V6L12 2Z"
                stroke="#626262"
                strokeWidth={1.6}
                strokeLinejoin="round"
              />

              <Path
                d="M8 12L11 15L16 9"
                stroke="#626262"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>

            <Text style={styles.footerText}>
              Authentication via 42 Intra
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  // Background decorations

  topDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  // App branding

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  appName: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 21,
    letterSpacing: -0.6,
    color: '#111111',
    flexShrink: 1,
  },

  // Globe illustration
  welcomeSection: {
      width: '100%',
      alignItems: 'center',
      gap: 8,
  },

  globe: {
    width: '50%',
    height: '50%',
    // maxWidth: 340,
    aspectRatio: 1,
    // backgroundColor: '#F5F5F5',
    marginTop: 50,
    marginBottom: 0,
  },

  // Welcome message

  introduction: {
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontFamily: 'Geist-Bold',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.5,
    color: '#111111',
    textAlign: 'center',
  },

  description: {
    fontFamily: 'Geist-Regular',
    fontSize: 16,
    lineHeight: 23,
    color: '#626262',
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 320,
  },

  // Authentication

  authentication: {
    width: '100%',
    maxWidth: 420,
    marginTop: 20,
  },

  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 18,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  schoolLogo: {
    width: 70,
    height: 26,
  },

  separator: {
    width: 1,
    height: 22,
    backgroundColor: '#777777',
  },

  buttonText: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.3,
    flexShrink: 1,
  },

  // Footer

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 18,
  },

  footerText: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    color: '#626262',
    flexShrink: 1,
  },
});