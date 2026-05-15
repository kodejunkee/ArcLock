/**
 * ArcLock Mobile — Register Screen
 * User registration form: name + email, then proceed to facial capture.
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
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validate()) {
      navigation.navigate('CameraCapture', {
        mode: 'register',
        email: email.trim().toLowerCase(),
        name: name.trim(),
      });
    }
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
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.iconContainer}
            >
              <Ionicons name="person-add" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register with your facial biometrics for secure authentication
            </Text>
          </View>

          {/* Form */}
          <GlassCard variant="elevated" style={styles.formCard}>
            <InputField
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
              icon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.text.muted}
                />
              }
            />

            <InputField
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
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
              title="Proceed to Face Enrollment"
              onPress={handleProceed}
              icon={<Ionicons name="camera" size={20} color="#fff" />}
              style={{ marginTop: 8 }}
            />
          </GlassCard>

          {/* Info card */}
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="shield-checkmark"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>
                Your facial data is encrypted and never stored as images
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="lock-closed" size={18} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Only encrypted biometric templates are saved
              </Text>
            </View>
          </GlassCard>

          {/* Login link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginHighlight}>Sign In</Text>
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
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
    maxWidth: 280,
  },
  formCard: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 212, 170, 0.04)',
    borderColor: 'rgba(0, 212, 170, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.xs,
    flex: 1,
    lineHeight: 18,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
  },
  loginHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
