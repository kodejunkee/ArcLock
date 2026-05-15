/**
 * ArcLock Mobile — InputField Component
 * Styled text input with floating label effect.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TextInputProps,
} from 'react-native';
import { COLORS, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  icon,
  value,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.surface.border, COLORS.primary],
  });

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          isFocused && styles.labelFocused,
          error ? styles.labelError : null,
        ]}
      >
        {label}
      </Text>
      <Animated.View
        style={[
          styles.inputWrapper,
          { borderColor: error ? COLORS.danger : borderColor },
        ]}
      >
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={COLORS.text.muted}
          selectionColor={COLORS.primary}
          {...rest}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  labelFocused: {
    color: COLORS.primary,
  },
  labelError: {
    color: COLORS.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  iconWrapper: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.md,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    paddingLeft: 12,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.xs,
    marginTop: 6,
    marginLeft: 4,
  },
});
