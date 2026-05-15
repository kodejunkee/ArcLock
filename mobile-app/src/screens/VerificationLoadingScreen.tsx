/**
 * ArcLock Mobile — Verification Loading Screen
 * Sends captured face to backend for verification.
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
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerificationLoading'>;
  route: RouteProp<AuthStackParamList, 'VerificationLoading'>;
};

export const VerificationLoadingScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { imageBase64, email } = route.params;
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const processVerification = async () => {
      try {
        const response = await authService.verifyFace(email, imageBase64);

        if (response.success && response.data) {
          await login(response.data.user, response.data.tokens);
          navigation.replace('VerificationSuccess', {
            similarity: response.data.similarity || 0,
            userName: response.data.user.name,
          });
        } else {
          navigation.replace('VerificationFailure', {
            reason: response.message || 'Verification failed',
            email,
          });
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Verification failed. Please try again.';
        navigation.replace('VerificationFailure', {
          reason: message,
          email,
        });
      }
    };

    processVerification();
  }, []);

  return (
    <View style={styles.container}>
      <LoadingOverlay
        message="Verifying Identity"
        subMessage="Comparing facial biometrics..."
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
