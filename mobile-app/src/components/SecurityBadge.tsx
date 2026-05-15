/**
 * ArcLock Mobile — SecurityBadge Component
 * Status badge showing security/verification state.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface SecurityBadgeProps {
  status: 'verified' | 'unverified' | 'locked' | 'active';
  size?: 'small' | 'medium';
}

const STATUS_CONFIG = {
  verified: {
    label: 'Verified',
    icon: 'shield-checkmark' as const,
    color: COLORS.success,
    bg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  unverified: {
    label: 'Unverified',
    icon: 'shield-outline' as const,
    color: COLORS.warning,
    bg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  locked: {
    label: 'Locked',
    icon: 'lock-closed' as const,
    color: COLORS.danger,
    bg: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  active: {
    label: 'Active',
    icon: 'shield-checkmark' as const,
    color: COLORS.primary,
    bg: 'rgba(0, 212, 170, 0.12)',
    borderColor: 'rgba(0, 212, 170, 0.25)',
  },
};

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const config = STATUS_CONFIG[status];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.borderColor,
          paddingVertical: isSmall ? 4 : 8,
          paddingHorizontal: isSmall ? 10 : 14,
        },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSmall ? 12 : 16}
        color={config.color}
      />
      <Text
        style={[
          styles.label,
          {
            color: config.color,
            fontSize: isSmall ? FONT_SIZE.xs : FONT_SIZE.sm,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
