/**
 * ArcLock Mobile — Dashboard Screen
 * Main app dashboard with security status, stats, and recent activity.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { SecurityBadge } from '../components/SecurityBadge';
import { ActivityItem } from '../components/ActivityItem';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/user.service';
import { AuthLog } from '../types/auth';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

export const DashboardScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, success: 0, failures: 0 });

  const fetchData = async () => {
    try {
      const response = await userService.getAuthLogs(10);
      if (response.success && response.data) {
        const authLogs = response.data.logs;
        setLogs(authLogs);
        setStats({
          total: authLogs.length,
          success: authLogs.filter((l) => l.status === 'success').length,
          failures: authLogs.filter((l) => l.status === 'failure').length,
        });
      }
    } catch (error) {
      // Silently fail — dashboard still shows
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <LinearGradient
      colors={[COLORS.bg.primary, '#0D1321', COLORS.bg.secondary]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <SecurityBadge status="active" />
        </View>

        {/* Security Status Card */}
        <GlassCard variant="elevated" style={styles.statusCard}>
          <LinearGradient
            colors={['rgba(0,212,170,0.08)', 'rgba(99,102,241,0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusGradient}
          >
            <View style={styles.statusHeader}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
              <Text style={styles.statusTitle}>Security Status</Text>
            </View>
            <Text style={styles.statusText}>
              Your biometric profile is active and secured with ECC encryption.
            </Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: COLORS.success }]}>
                  {stats.success}
                </Text>
                <Text style={styles.statLabel}>Success</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: COLORS.danger }]}>
                  {stats.failures}
                </Text>
                <Text style={styles.statLabel}>Failed</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        {/* Quick Info Cards */}
        <View style={styles.infoGrid}>
          <GlassCard style={styles.infoGridItem}>
            <Ionicons name="finger-print" size={28} color={COLORS.primary} />
            <Text style={styles.infoGridTitle}>Biometric</Text>
            <Text style={styles.infoGridValue}>Enrolled</Text>
          </GlassCard>
          <GlassCard style={styles.infoGridItem}>
            <Ionicons name="lock-closed" size={28} color={COLORS.accent} />
            <Text style={styles.infoGridTitle}>Encryption</Text>
            <Text style={styles.infoGridValue}>ECC Active</Text>
          </GlassCard>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionSubtitle}>Last {logs.length} events</Text>
        </View>

        {logs.length > 0 ? (
          logs.slice(0, 5).map((log) => (
            <ActivityItem
              key={log._id}
              status={log.status}
              timestamp={log.timestamp}
              device={log.device}
              similarity={log.similarity}
            />
          ))
        ) : (
          <GlassCard>
            <Text style={styles.emptyText}>
              No activity yet. Your authentication events will appear here.
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  statusCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statusGradient: {
    padding: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  statusTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  statusText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.surface.border,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  infoGridItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  infoGridTitle: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  infoGridValue: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.xs,
  },
  emptyText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
