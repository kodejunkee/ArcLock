/**
 * ArcLock Mobile — Enrollment Success Screen
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { BiometricButton } from '../components/BiometricButton';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EnrollmentSuccess'>;
};

export const EnrollmentSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 6,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      {/* Success animation */}
      <Animated.View
        style={[
          styles.successIcon,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={[COLORS.success, COLORS.primary]}
          style={styles.iconGradient}
        >
          <Ionicons name="checkmark-circle" size={64} color="#fff" />
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Enrollment Complete</Text>
        <Text style={styles.subtitle}>
          Welcome, {user?.name || 'User'}! Your facial biometrics have been securely enrolled.
        </Text>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>Facial template encrypted with ECC</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cloud-done" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>Encrypted data stored securely</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="trash" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>Raw image destroyed from memory</Text>
          </View>
        </GlassCard>

        <BiometricButton
          title="Go to Dashboard"
          onPress={() => {
            // Navigate to main app — the root navigator handles this
            // by checking isAuthenticated
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Main' as never }],
            });
          }}
          icon={<Ionicons name="apps" size={20} color="#fff" />}
          style={{ marginTop: 12 }}
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  successIcon: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 300,
  },
  infoCard: {
    width: '100%',
    gap: 14,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
});
