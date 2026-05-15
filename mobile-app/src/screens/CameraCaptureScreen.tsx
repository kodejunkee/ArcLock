/**
 * ArcLock Mobile — Camera Capture Screen
 * Camera view with face alignment guide for enrollment/verification.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../types/navigation';
import { FaceGuideOverlay } from '../components/FaceGuideOverlay';
import { COLORS, FONT_SIZE } from '../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'CameraCapture'>;
  route: RouteProp<AuthStackParamList, 'CameraCapture'>;
};

export const CameraCaptureScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { mode, email, name } = route.params;
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('front');

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={COLORS.text.muted} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          ArcLock needs camera access for facial biometric authentication.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      if (!photo?.base64) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        setIsCapturing(false);
        return;
      }

      const imageBase64 = photo.base64;

      if (mode === 'register') {
        navigation.replace('EnrollmentProcessing', {
          imageBase64,
          email: email!,
          name: name!,
        });
      } else {
        navigation.replace('VerificationLoading', {
          imageBase64,
          email: email!,
        });
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mirror={true}
      >
        <FaceGuideOverlay
          instruction={
            mode === 'register'
              ? 'Position your face for enrollment'
              : 'Position your face for verification'
          }
          isProcessing={isCapturing}
        />

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipBtn}
            onPress={() =>
              setFacing((prev) => (prev === 'front' ? 'back' : 'front'))
            }
          >
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Capture button */}
        <View style={styles.captureContainer}>
          <TouchableOpacity
            style={[styles.captureBtn, isCapturing && styles.captureBtnDisabled]}
            onPress={handleCapture}
            disabled={isCapturing}
            activeOpacity={0.7}
          >
            <View style={styles.captureInner}>
              {isCapturing ? (
                <Ionicons name="hourglass" size={28} color={COLORS.primary} />
              ) : (
                <Ionicons name="scan" size={28} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.captureLabel}>
            {isCapturing ? 'Capturing...' : 'Tap to capture'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 170, 0.15)',
  },
  captureBtnDisabled: {
    opacity: 0.5,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureLabel: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  permissionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
