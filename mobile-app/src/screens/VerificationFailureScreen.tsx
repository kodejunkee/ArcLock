/**
 * ArcLock Mobile — Verification Failure Screen
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../types/navigation';
import { BiometricButton } from '../components/BiometricButton';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerificationFailure'>;
  route: RouteProp<AuthStackParamList, 'VerificationFailure'>;
};

export const VerificationFailureScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { reason, email } = route.params;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      {/* Error icon with shake */}
      <Animated.View
        style={[
          styles.iconWrapper,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <View style={styles.errorCircle}>
          <Ionicons name="close" size={48} color={COLORS.danger} />
        </View>
      </Animated.View>

      <Text style={styles.title}>Verification Failed</Text>

      <GlassCard style={styles.reasonCard}>
        <View style={styles.reasonRow}>
          <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      </GlassCard>

      <View style={styles.actions}>
        <BiometricButton
          title="Try Again"
          onPress={() =>
            navigation.replace('CameraCapture', {
              mode: 'verify',
              email,
            })
          }
          icon={<Ionicons name="refresh" size={20} color="#fff" />}
        />

        <BiometricButton
          title="Back to Login"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 12 }}
        />
      </View>
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
  iconWrapper: {
    marginBottom: 24,
  },
  errorCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: 20,
  },
  reasonCard: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderColor: 'rgba(239, 68, 68, 0.15)',
    marginBottom: 32,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reasonText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
  },
});
