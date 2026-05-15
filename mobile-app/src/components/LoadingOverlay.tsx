/**
 * ArcLock Mobile — LoadingOverlay Component
 * Full-screen loading indicator with animated scanner effect.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, FONT_SIZE } from '../constants/theme';

const { width } = Dimensions.get('window');

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Processing...',
  subMessage,
}) => {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scanning line animation
    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Pulsing ring
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Dot animation
    const dots = Animated.loop(
      Animated.timing(dotAnim, {
        toValue: 3,
        duration: 1500,
        useNativeDriver: false,
      })
    );

    scan.start();
    pulse.start();
    dots.start();

    return () => {
      scan.stop();
      pulse.stop();
      dots.stop();
    };
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 40],
  });

  return (
    <View style={styles.container}>
      {/* Animated biometric scanner icon */}
      <View style={styles.scannerContainer}>
        <Animated.View
          style={[
            styles.outerRing,
            { opacity: pulseAnim, transform: [{ scale: pulseAnim }] },
          ]}
        />
        <View style={styles.innerRing}>
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY }] }]}
          />
          {/* Shield icon made with views */}
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldText}>🔒</Text>
          </View>
        </View>
      </View>

      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 26, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  scannerContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  outerRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  innerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  shieldIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldText: {
    fontSize: 28,
  },
  message: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    maxWidth: width * 0.7,
  },
});
