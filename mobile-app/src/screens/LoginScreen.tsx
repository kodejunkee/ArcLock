/**
 * ArcLock Mobile — Login Screen
 * Face-based authentication login.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { InputField } from '../components/InputField';
import { BiometricButton } from '../components/BiometricButton';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    navigation.navigate('CameraCapture', {
      mode: 'verify',
      email: email.trim().toLowerCase(),
    });
  };

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[COLORS.accent, COLORS.primary]}
              style={styles.iconContainer}
            >
              <Ionicons name="scan" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Verify your identity with facial biometrics
            </Text>
          </View>

          {/* Form */}
          <GlassCard variant="elevated" style={styles.formCard}>
            <InputField
              label="Email Address"
              placeholder="Enter your registered email"
              value={email}
              onChangeText={setEmail}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              icon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.text.muted}
                />
              }
            />

            <BiometricButton
              title="Verify Face to Login"
              onPress={handleLogin}
              icon={<Ionicons name="scan" size={20} color="#fff" />}
              style={{ marginTop: 8 }}
            />
          </GlassCard>

          {/* Security info */}
          <GlassCard style={styles.securityCard}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield" size={20} color={COLORS.primary} />
              <Text style={styles.securityTitle}>How it works</Text>
            </View>
            <View style={styles.steps}>
              {[
                'Enter your registered email',
                'Capture your face via camera',
                'Your face is verified against stored template',
                'Access granted upon successful match',
              ].map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Register link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerHighlight}>Register</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 20,
  },
  securityCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  securityTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  steps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  stepText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
  },
  registerHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
