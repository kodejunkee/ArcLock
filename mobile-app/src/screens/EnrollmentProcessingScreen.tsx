/**
 * ArcLock Mobile — Enrollment Processing Screen
 * Sends captured face to backend for registration.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../types/navigation';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'EnrollmentProcessing'>;
  route: RouteProp<AuthStackParamList, 'EnrollmentProcessing'>;
};

export const EnrollmentProcessingScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { imageBase64, email, name } = route.params;
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const processRegistration = async () => {
      try {
        const response = await authService.register(name, email, imageBase64);

        if (response.success && response.data) {
          await login(response.data.user, response.data.tokens);
          navigation.replace('EnrollmentSuccess');
        } else {
          navigation.replace('VerificationFailure', {
            reason: response.message || 'Registration failed',
            email,
          });
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Registration failed. Please try again.';
        navigation.replace('VerificationFailure', {
          reason: message,
          email,
        });
      }
    };

    processRegistration();
  }, []);

  return (
    <View style={styles.container}>
      <LoadingOverlay
        message="Enrolling Biometrics"
        subMessage="Generating encrypted facial template..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
  },
});
