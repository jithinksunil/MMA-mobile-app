import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';
import { Card, CardHeader, Button } from '../components';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: '1', icon: 'flash', label: 'Quick Start', color: Colors.primary },
  { id: '2', icon: 'search', label: 'Explore', color: Colors.secondary },
  { id: '3', icon: 'star', label: 'Favorites', color: Colors.info },
  { id: '4', icon: 'settings', label: 'Settings', color: Colors.success },
];

const RECENT_ITEMS = [
  { id: '1', title: 'Item One', subtitle: 'Description for item one', badge: 'New' },
  { id: '2', title: 'Item Two', subtitle: 'Description for item two', badge: null },
  { id: '3', title: 'Item Three', subtitle: 'Description for item three', badge: 'Hot' },
];

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.username}>Welcome Back!</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>FEATURED</Text>
            <Text style={styles.heroTitle}>Get Started{'\n'}with Your App</Text>
            <Text style={styles.heroSubtitle}>
              This is your cross-platform React Native template.
            </Text>
            <Button
              title="Explore Now"
              onPress={() => {}}
              size="sm"
              style={styles.heroButton}
            />
          </View>
          <View style={styles.heroDecoration}>
            <Ionicons name="rocket" size={80} color="rgba(255,255,255,0.15)" />
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickAction} activeOpacity={0.8}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '22' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {RECENT_ITEMS.map((item) => (
          <Card key={item.id} style={styles.itemCard} onPress={() => {}} elevated>
            <View style={styles.itemContent}>
              <View style={styles.itemIconContainer}>
                <Ionicons name="document-text" size={22} color={Colors.primary} />
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>
          </Card>
        ))}

        {/* Stats Row */}
        <Text style={styles.sectionTitle}>Stats Overview</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: '128', icon: 'layers' },
            { label: 'Active', value: '42', icon: 'pulse' },
            { label: 'Done', value: '86', icon: 'checkmark-circle' },
          ].map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  username: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.lg,
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    fontSize: Typography.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightXl,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeightBase,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroDecoration: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  seeAll: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
    width: (width - Spacing.md * 2 - Spacing.md * 3) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  itemCard: {
    marginBottom: Spacing.sm,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.primary + '33',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radii.full,
    marginRight: Spacing.sm,
  },
  badgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
