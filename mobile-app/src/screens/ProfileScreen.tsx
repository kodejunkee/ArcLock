/**
 * ArcLock Mobile — Profile Screen
 * User profile with security settings and account management.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { BiometricButton } from '../components/BiometricButton';
import { SecurityBadge } from '../components/SecurityBadge';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/user.service';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all biometric data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await userService.deleteAccount();
              await clearAuth();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
            setDeleting(false);
          },
        },
      ]
    );
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Profile</Text>

        {/* User card */}
        <GlassCard variant="elevated" style={styles.userCard}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            style={styles.avatar}
          >
            <Ionicons name="person" size={36} color="#fff" />
          </LinearGradient>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          <View style={styles.badgeRow}>
            <SecurityBadge status="active" size="small" />
            <Text style={styles.memberSince}>Member since {memberSince}</Text>
          </View>
        </GlassCard>

        {/* Security section */}
        <Text style={styles.sectionTitle}>Security</Text>
        <GlassCard style={styles.settingsCard}>
          <SettingRow
            icon="shield-checkmark"
            iconColor={COLORS.success}
            title="Biometric Status"
            value="Enrolled"
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="lock-closed"
            iconColor={COLORS.primary}
            title="Encryption"
            value="ECC / AES-256"
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="cloud-done"
            iconColor={COLORS.accent}
            title="Cloud Storage"
            value="MongoDB Atlas"
          />
          <View style={styles.settingDivider} />
          <SettingRow
            icon="key"
            iconColor={COLORS.warning}
            title="Key Management"
            value="Per-User Keys"
          />
        </GlassCard>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.actions}>
          <BiometricButton
            title="Sign Out"
            variant="secondary"
            onPress={handleLogout}
            icon={<Ionicons name="log-out-outline" size={20} color="#fff" />}
          />
          <BiometricButton
            title="Delete Account"
            variant="danger"
            onPress={handleDeleteAccount}
            loading={deleting}
            icon={<Ionicons name="trash-outline" size={20} color={COLORS.danger} />}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const SettingRow: React.FC<{
  icon: string;
  iconColor: string;
  title: string;
  value: string;
}> = ({ icon, iconColor, title, value }) => (
  <View style={settingStyles.row}>
    <View style={[settingStyles.iconCircle, { backgroundColor: `${iconColor}15` }]}>
      <Ionicons name={icon as any} size={18} color={iconColor} />
    </View>
    <Text style={settingStyles.title}>{title}</Text>
    <Text style={settingStyles.value}>{value}</Text>
  </View>
);

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  headerTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: 24,
  },
  userCard: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  userName: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberSince: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.xs,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: 14,
  },
  settingsCard: {
    marginBottom: 28,
    gap: 6,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.surface.border,
    marginVertical: 6,
  },
  actions: {
    gap: 0,
  },
});
