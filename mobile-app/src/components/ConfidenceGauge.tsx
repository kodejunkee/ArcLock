/**
 * ArcLock Mobile — ConfidenceGauge Component
 * Animated arc gauge showing biometric match confidence.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONT_SIZE } from '../constants/theme';

interface ConfidenceGaugeProps {
  similarity: number; // 0.0 to 1.0
  size?: number;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  similarity,
  size = 160,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: similarity,
      useNativeDriver: false,
      tension: 30,
      friction: 8,
    }).start();
  }, [similarity]);

  const percentage = Math.round(similarity * 100);
  const isHigh = similarity >= 0.8;
  const isMedium = similarity >= 0.6;
  const gaugeColor = isHigh ? COLORS.success : isMedium ? COLORS.primary : COLORS.danger;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: 'rgba(255,255,255,0.06)',
          },
        ]}
      />

      {/* Animated colored ring segment (simplified with border trick) */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: gaugeColor,
            opacity: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      />

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={[styles.percentage, { color: gaugeColor }]}>
          {percentage}%
        </Text>
        <Text style={styles.label}>Match</Text>
      </View>

      {/* Glow effect */}
      <View
        style={[
          styles.glow,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            shadowColor: gaugeColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 4,
  },
  centerContent: {
    alignItems: 'center',
  },
  percentage: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '800',
    letterSpacing: -1,
  },
  label: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginTop: 2,
  },
  glow: {
    position: 'absolute',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
});
