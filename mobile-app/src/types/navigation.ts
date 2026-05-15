/**
 * ArcLock Mobile — Navigation Types
 */

export type AuthStackParamList = {
  Splash: undefined;
  Register: undefined;
  Login: undefined;
  CameraCapture: { mode: 'register' | 'verify'; email?: string; name?: string };
  EnrollmentProcessing: { imageBase64: string; email: string; name: string };
  EnrollmentSuccess: undefined;
  VerificationLoading: { imageBase64: string; email: string };
  VerificationSuccess: { similarity: number; userName: string };
  VerificationFailure: { reason: string; email: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Activity: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
