import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type UbuntuSpinnerProps = {
  size?: number;
  color?: string;
};

export default function UbuntuSpinner({
  size = 28,
  color = '#222222',
}: UbuntuSpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const segments = [0, 120, 240];

  const dotsPerSegment = 24;
  const arcLength = 85;
  const radius = 17;
  const center = 25;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ rotate }],
      }}>
      <Svg width={size} height={size} viewBox="0 0 50 50">
        {segments.map(startAngle =>
          Array.from({ length: dotsPerSegment }, (_, index) => {
            const progress = index / (dotsPerSegment - 1);

            const angle =
              ((startAngle + progress * arcLength) * Math.PI) / 180;

            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);

            // Large, opaque head → small, transparent tail
            const dotRadius = 2.8 * (1 - progress) + 0.2;
            const opacity = Math.pow(1 - progress, 1.5);

            return (
              <Circle
                key={`${startAngle}-${index}`}
                cx={x}
                cy={y}
                r={dotRadius}
                fill={color}
                opacity={opacity}
              />
            );
          }),
        )}
      </Svg>
    </Animated.View>
  );
}