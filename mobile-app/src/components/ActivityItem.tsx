/**
 * ArcLock Mobile — ActivityItem Component
 * Auth log entry displayed in the activity list.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface ActivityItemProps {
  status: 'success' | 'failure';
  timestamp: string;
  device?: string;
  similarity?: number;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  status,
  timestamp,
  device = 'Unknown Device',
  similarity,
}) => {
  const isSuccess = status === 'success';
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isSuccess
              ? 'rgba(16, 185, 129, 0.12)'
              : 'rgba(239, 68, 68, 0.12)',
          },
        ]}
      >
        <Ionicons
          name={isSuccess ? 'checkmark-circle' : 'close-circle'}
          size={22}
          color={isSuccess ? COLORS.success : COLORS.danger}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {isSuccess ? 'Authentication Successful' : 'Authentication Failed'}
        </Text>
        <Text style={styles.subtitle}>
          {device} • {formattedDate}
        </Text>
      </View>

      {similarity !== undefined && (
        <View style={styles.similarity}>
          <Text
            style={[
              styles.similarityText,
              { color: isSuccess ? COLORS.success : COLORS.danger },
            ]}
          >
            {(similarity * 100).toFixed(0)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surface.border,
    padding: 14,
    marginBottom: 10,
    gap: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: 3,
  },
  subtitle: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.xs,
  },
  similarity: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: BORDER_RADIUS.sm,
  },
  similarityText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});
