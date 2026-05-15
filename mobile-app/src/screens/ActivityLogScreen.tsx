/**
 * ArcLock Mobile — Activity Log Screen
 * Full authentication history and failed attempt logs.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { ActivityItem } from '../components/ActivityItem';
import { userService } from '../services/user.service';
import { AuthLog } from '../types/auth';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

type Tab = 'all' | 'success' | 'failures';

export const ActivityLogScreen: React.FC = () => {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const fetchLogs = async () => {
    try {
      const response = await userService.getAuthLogs(50);
      if (response.success && response.data) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  const filteredLogs = logs.filter((log) => {
    if (activeTab === 'success') return log.status === 'success';
    if (activeTab === 'failures') return log.status === 'failure';
    return true;
  });

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
        <Text style={styles.headerTitle}>Activity Log</Text>
        <Text style={styles.headerSubtitle}>
          Authentication history and security events
        </Text>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {(['all', 'success', 'failures'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 'all' ? 'All' : tab === 'success' ? 'Success' : 'Failed'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logs list */}
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <ActivityItem
              key={log._id}
              status={log.status}
              timestamp={log.timestamp}
              device={log.device}
              similarity={log.similarity}
            />
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={40} color={COLORS.text.muted} />
            <Text style={styles.emptyText}>
              No {activeTab === 'all' ? '' : activeTab} events found
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
  headerTitle: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.surface.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.sm,
  },
});
