/**
 * ArcLock Mobile — FaceGuideOverlay Component
 * Animated oval face alignment guide displayed over the camera.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, FONT_SIZE } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const OVAL_WIDTH = SCREEN_WIDTH * 0.65;
const OVAL_HEIGHT = OVAL_WIDTH * 1.35;

interface FaceGuideOverlayProps {
  instruction?: string;
  isProcessing?: boolean;
}

export const FaceGuideOverlay: React.FC<FaceGuideOverlayProps> = ({
  instruction = 'Position your face within the guide',
  isProcessing = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing scale animation (native driver — runs on UI thread)
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Color cycling for the border (JS driver — needed for color interpolation)
    const colorCycle = Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );

    pulse.start();
    colorCycle.start();

    return () => {
      pulse.stop();
      colorCycle.stop();
    };
  }, []);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.primary, COLORS.accent],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Semi-transparent overlay with cutout */}
      <View style={styles.overlay}>
        {/* Top section */}
        <View style={styles.topSection}>
          <Text style={styles.instructionText}>
            {isProcessing ? 'Processing...' : instruction}
          </Text>
        </View>

        {/* Middle section with oval cutout */}
        <View style={styles.middleSection}>
          {/* Outer node: native-driven scale animation */}
          <Animated.View
            style={[
              styles.ovalScaleWrapper,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            {/* Inner node: JS-driven border color animation */}
            <Animated.View
              style={[
                styles.ovalGuide,
                { borderColor: borderColor },
              ]}
            >
              {/* Corner markers */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <Text style={styles.hintText}>
            Ensure good lighting • Face the camera directly
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  middleSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: OVAL_HEIGHT + 20,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 26, 0.7)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
  ovalScaleWrapper: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalGuide: {
    width: '100%',
    height: '100%',
    borderRadius: OVAL_WIDTH / 2,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hintText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 20,
    right: 20,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 8,
  },
});
