/**
 * ArcLock Mobile — Splash Screen
 * Animated app launch screen with ArcLock branding.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { useAuthStore } from '../store/authStore';
import { COLORS, FONT_SIZE } from '../constants/theme';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;

  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);

  useEffect(() => {
    // Animate logo entrance
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Expanding ring
      Animated.parallel([
        Animated.timing(ringScale, {
          toValue: 3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Title and subtitle
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    const timer = setTimeout(async () => {
      const hasAuth = await loadStoredAuth();
      // Always go to Login — user needs to verify face even if tokens exist
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      {/* Background grid lines */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.gridLine,
              { top: (height / 8) * i, width: '100%', height: 1 },
            ]}
          />
        ))}
      </View>

      {/* Expanding ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          style={styles.logoGradient}
        >
          <Ionicons name="shield-checkmark" size={48} color="#fff" />
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslate }],
        }}
      >
        <Text style={styles.title}>ArcLock</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={styles.subtitle}>Biometric Authentication</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>Secure • Private • Encrypted</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 1,
  },
  tagline: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
