/**
 * ArcLock Mobile — Verification Success Screen
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../types/navigation';
import { BiometricButton } from '../components/BiometricButton';
import { ConfidenceGauge } from '../components/ConfidenceGauge';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerificationSuccess'>;
  route: RouteProp<AuthStackParamList, 'VerificationSuccess'>;
};

export const VerificationSuccessScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { similarity, userName } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Confidence gauge */}
        <ConfidenceGauge similarity={similarity} size={180} />

        <View style={styles.textContent}>
          <Text style={styles.title}>Identity Verified</Text>
          <Text style={styles.greeting}>Welcome back, {userName}!</Text>
          <Text style={styles.similarity}>
            Confidence Score: {(similarity * 100).toFixed(1)}%
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
          <Text style={styles.statusText}>Authentication Successful</Text>
        </View>

        <BiometricButton
          title="Continue to Dashboard"
          onPress={() => {
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Main' as never }],
            });
          }}
          icon={<Ionicons name="apps" size={20} color="#fff" />}
          style={{ width: '100%', marginTop: 24 }}
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
  content: {
    width: '100%',
    alignItems: 'center',
  },
  textContent: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  title: {
    color: COLORS.success,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: 8,
  },
  greeting: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
    marginBottom: 6,
  },
  similarity: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
