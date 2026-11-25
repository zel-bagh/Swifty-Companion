
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';


export default function ErrorScreen({ type, onRetry }: { type: 'app' | 'connection'; onRetry: () => void }) {
    const isConnection = type === 'connection';

    const title = isConnection
        ? 'Connection failed'
        : 'Something went wrong';

    const message = isConnection
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : 'An unexpected error occurred. Please try again.';
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Svg width={60} height={60} viewBox="0 0 24 24">
          {type === 'connection' ? (
            <>
              <Path
                d="M2 8.82a15 15 0 0 1 20 0"
                fill="none"
                stroke="#111111"
                strokeWidth={1.3}
                strokeLinecap="round"
              />
              <Path
                d="M5 12.86a10 10 0 0 1 4.17-2.13"
                fill="none"
                stroke="#111111"
                strokeWidth={1.3}
                strokeLinecap="round"
              />
              <Path
                d="M14.83 10.73A10 10 0 0 1 19 12.86"
                fill="none"
                stroke="#111111"
                strokeWidth={1.3}
                strokeLinecap="round"
              />
              <Path
                d="M8.5 16.43a5 5 0 0 1 7 0M12 20h.01M2 2l20 20"
                fill="none"
                stroke="#111111"
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <Path
                d="M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                fill="none"
                stroke="#111111"
                strokeWidth={1.3}
                strokeLinejoin="round"
              />
              <Path
                d="M12 9v4"
                stroke="#111111"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <Circle cx={12} cy={17} r={0.9} fill="#111111" />
            </>
          )}
        </Svg>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          {message}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          If the problem persists, please report it to the developer.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 24,
    letterSpacing: -0.8,
    color: '#111111',
    // marginTop: 28,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Geist-Regular',
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#111111',
    borderRadius: 10,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontFamily: 'Geist-Medium',
    color: '#FFFFFF',
    fontSize: 16,
  },
  footer: {
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 10,
  },
});
