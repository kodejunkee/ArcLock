/**
 * ArcLock Mobile — Auth Stack Navigator
 * Authentication flow: Splash → Register/Login → Camera → Processing → Result
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';

import { SplashScreen } from '../screens/SplashScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CameraCaptureScreen } from '../screens/CameraCaptureScreen';
import { EnrollmentProcessingScreen } from '../screens/EnrollmentProcessingScreen';
import { EnrollmentSuccessScreen } from '../screens/EnrollmentSuccessScreen';
import { VerificationLoadingScreen } from '../screens/VerificationLoadingScreen';
import { VerificationSuccessScreen } from '../screens/VerificationSuccessScreen';
import { VerificationFailureScreen } from '../screens/VerificationFailureScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#0A0E1A' },
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="CameraCapture"
        component={CameraCaptureScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="EnrollmentProcessing"
        component={EnrollmentProcessingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="EnrollmentSuccess"
        component={EnrollmentSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="VerificationLoading"
        component={VerificationLoadingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="VerificationSuccess"
        component={VerificationSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="VerificationFailure"
        component={VerificationFailureScreen}
      />
    </Stack.Navigator>
  );
};
