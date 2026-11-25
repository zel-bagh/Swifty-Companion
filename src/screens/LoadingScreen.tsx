import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UbuntuSpinner from '../components/UbuntuSpinner';

export default function LoadingPage() {
  const cursorOpacity = useRef(new Animated.Value(1)).current;

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/light/1337light.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.messageContainer}>
          <Text style={styles.message}>Future is loading</Text>

          <Animated.Text
            style={[styles.message, { opacity: cursorOpacity }]}>
            _
          </Animated.Text>
        </View>

        <View style={styles.spinnerContainer}>
          <UbuntuSpinner />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 60,
    // marginBottom: 10,
    // borderWidth: 1,
    // borderColor: ' #000000',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  spinnerContainer: {
    marginTop: 15,
  },
});