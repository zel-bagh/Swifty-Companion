import Config from 'react-native-config';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Linking,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { generateState } from '../services/authService';
import { handleRedirect } from '../services/authService';
import { Path, Svg } from 'react-native-svg';


export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const expectedState = useRef<string>(generateState());
    const { width, height } = useWindowDimensions();
    const [typedText, setTypedText] = useState('');
    const cursorOpacity = useRef(new Animated.Value(1)).current;
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
    // Typewriter animation
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setTypedText(MESSAGE.slice(0, index));

      if (index >= MESSAGE.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  // Blinking cursor
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [cursorOpacity]);

    const params = {
      client_id: uid,
      redirect_uri: 'swiftycompanion://oauth/callback',
      response_type: "code",
      scope: "public",
      state: expectedState.current
    };
    const queryString = new URLSearchParams(params).toString();
    const authorizationUrl = `https://api.intra.42.fr/oauth/authorize?${queryString}`;
    
    const MESSAGE = 'Your campus.\nYour people.';
    const PARTICLE_COUNT = 45;

return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Campus section */}
<View style={styles.hero}>
  <Image
    source={require('../assets/images/light/campus.png')}
    style={styles.backgroundImage}
    resizeMode="cover"
    blurRadius={1.5}
  />

        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Floating particles */}
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
            <Particle
              key={index}
              width={width}
              height={height * 0.7}
            />
          ))}
        </View>

        <SafeAreaView
          edges={['top']}
          style={styles.heroContent}
        >
          {/* App branding */}
          <View style={styles.header}>
            <Svg width={38} height={32} viewBox="0 0 48 40">
              <Path
                d="M18 2H32L14 23L0 28Z"
                fill="#FFFFFF"
              />
              <Path
                d="M34 12H48L27 38H13Z"
                fill="#FFFFFF"
              />
            </Svg>

            <Text style={styles.appName}>
              Swifty Companion
            </Text>
          </View>

          {/* Animated welcome message */}
          <View style={styles.welcome}>
            <View style={styles.messageContainer}>
              <Text style={[styles.message, { opacity: 0 }]}>
                {MESSAGE}|
              </Text>

              <Text style={[styles.message, styles.typedMessage]}>
                {typedText}
                <Animated.Text style={{ opacity: cursorOpacity }}>
                  |
                </Animated.Text>
              </Text>
            </View>

            <View style={styles.taglineContainer}>
              <View style={styles.line} />

              <Text style={styles.tagline}>
                LEARN. BUILD. CONNECT.
              </Text>

              <View style={styles.line} />
            </View>
          </View>
        </SafeAreaView>
        <Svg
          width="100%"
          height={50}
          viewBox="0 0 400 50"
          preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}
        >
          <Path
            d="M0 25 C100 65 280 -15 400 25 L400 50 L0 50 Z"
            fill="#FFFFFF"
          />
        </Svg>
      </View>

      {/* Authentication section */}
      <SafeAreaView
        edges={['bottom']}
        style={styles.authentication}
      >
        <Pressable
          onPress={async () => {
            await Linking.openURL(authorizationUrl);
          }}
          accessibilityRole="button"
          accessibilityLabel="Continue with 42"
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

          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M4 12H20M14 6L20 12L14 18"
              stroke="#FFFFFF"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Pressable>

        {/* Authentication footer */}
        <View style={styles.footer}>
          <Svg width={20} height={22} viewBox="0 0 24 24">
            <Path
              d="M12 2L21 6V11C21 16 17 20 12 22C7 20 3 16 3 11V6L12 2Z"
              stroke="#626262"
              strokeWidth={1.6}
              strokeLinejoin="round"
              fill="none"
            />

            <Path
              d="M8 12L11 15L16 9"
              stroke="#626262"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>

          <Text style={styles.footerText}>
            Authentication via 42 Intra
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Floating particle component

function Particle({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  const particle = useRef({
    x: Math.random(),
    size: 1 + Math.random() * 2,
    duration: 8000 + Math.random() * 10000,
    delay: Math.random() * 8000,
    drift: 10 + Math.random() * 30,
    opacity: 0.3 + Math.random() * 0.6,
  }).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(particle.delay),

      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: particle.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    ]);

    animation.start();

    return () => animation.stop();
  }, [progress, particle]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [height + 10, -10],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      0,
      particle.drift,
      -particle.drift * 0.5,
      particle.drift * 0.8,
      -particle.drift,
      particle.drift * 0.3,
    ],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.15, 0.8, 1],
    outputRange: [0, particle.opacity, particle.opacity, 0],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: particle.x * width,
        width: particle.size,
        height: particle.size,
        borderRadius: particle.size / 2,
        backgroundColor: '#FFFFFF',
        opacity,
        transform: [
          { translateX },
          { translateY },
        ],
      }}
    />
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  hero: {
    height: '70%',
    overflow: 'hidden',
    backgroundColor: '#151B20',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 15, 22, 0.58)',
  },

  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 32,
  },

  appName: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 23,
    letterSpacing: -0.8,
    color: '#FFFFFF',
    flexShrink: 1,
  },

  welcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },

  messageContainer: {
    position: 'relative',
  },

  message: {
    fontFamily: 'monospace',
    fontSize: 28,
    lineHeight: 42,
    color: '#FFFFFF',
    letterSpacing: -1,
    textAlign: 'left',
  },

  backgroundImage: {
  ...StyleSheet.absoluteFill,
  width: '100%',
  height: '100%',
},

  typedMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 32,
    width: '100%',
  },

  tagline: {
    fontFamily: 'Geist-Regular',
    fontSize: 10,
    letterSpacing: 2,
    color: '#DDDDDD',
  },

  line: {
    flex: 1,
    maxWidth: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  authentication: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
    gap: 22,
  },

  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    minHeight: 60,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 16,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  schoolLogo: {
    width: 80,
    // height: 20,
    aspectRatio: 4.15,
    tintColor: '#FFFFFF',
  },

  separator: {
    width: 1,
    height: 26,
    backgroundColor: '#777777',
  },

  buttonText: {
    flex: 1,
    fontFamily: 'Geist-SemiBold',
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.4,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  footerText: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    color: '#626262',
    flexShrink: 1,
  },
});
