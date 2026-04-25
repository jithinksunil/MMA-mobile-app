import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Card, Button } from '../components';
import { useProgressContext } from '../context/ProgressContext';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';

const TIER_BRONZE = '#CD7F32';
const TIER_SILVER = '#A8AAAD';
const TIER_GOLD = '#FFD700';
const TIER_PLATINUM = '#78C8D8';
const TIER_DIAMOND = '#B57BED';

const RANK_INFO = {
  rank: 127,
  totalFighters: 2841,
  tier: 'Silver',
  tierColor: TIER_SILVER,
  points: 1240,
  pointsToNext: 2000,
  nextTier: 'Gold',
};

const RANK_TIERS: { name: string; color: string }[] = [
  { name: 'Bronze', color: TIER_BRONZE },
  { name: 'Silver', color: TIER_SILVER },
  { name: 'Gold', color: TIER_GOLD },
  { name: 'Platinum', color: TIER_PLATINUM },
  { name: 'Diamond', color: TIER_DIAMOND },
];

export const ProfileScreen: React.FC = () => {
  const { stats } = useProgressContext();
  const trainingPercent = Math.min(
    stats.activePhaseTotalDays > 0
      ? stats.activePhaseDaysCompleted / stats.activePhaseTotalDays
      : 0,
    1,
  );
  const rankPercent = Math.min(RANK_INFO.points / RANK_INFO.pointsToNext, 1);
  const topPercent = Math.round((RANK_INFO.rank / RANK_INFO.totalFighters) * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name='create-outline' size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Avatar & Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name='person' size={52} color={Colors.primary} />
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name='checkmark' size={10} color={Colors.textPrimary} />
            </View>
          </View>

          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          <Text style={styles.bio}>MMA fighter in training. Committed to the grind every day.</Text>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Button title='Edit Profile' onPress={undefined} size='sm' style={styles.actionBtn} />
            <Button
              title='Share'
              onPress={undefined}
              variant='outline'
              size='sm'
              style={styles.actionBtn}
            />
          </View>
        </View>

        {/* Training Progress */}
        <Text style={styles.sectionTitle}>Training Progress</Text>
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressPhase}>{stats.activePhaseTitle}</Text>
              <Text style={styles.progressWeek}>{stats.activePhaseWeekRange}</Text>
            </View>
            <View style={styles.progressDaysBadge}>
              <Text style={styles.progressDaysText}>
                {stats.activePhaseDaysCompleted}/{stats.activePhaseTotalDays} days
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${trainingPercent * 100}%` }]} />
          </View>
          <Text style={styles.progressCaption}>
            {Math.round(trainingPercent * 100)}% of phase complete
          </Text>

          <View style={styles.trainingStatsRow}>
            <View style={styles.trainingStat}>
              <Ionicons name='flame' size={20} color={Colors.primary} />
              <Text style={styles.trainingStatValue}>{stats.currentStreak}</Text>
              <Text style={styles.trainingStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.trainingStatDivider} />
            <View style={styles.trainingStat}>
              <Ionicons name='barbell' size={20} color={Colors.secondary} />
              <Text style={styles.trainingStatValue}>{stats.totalExercisesCompleted}</Text>
              <Text style={styles.trainingStatLabel}>Sessions</Text>
            </View>
            <View style={styles.trainingStatDivider} />
            <View style={styles.trainingStat}>
              <Ionicons name='flag' size={20} color={Colors.success} />
              <Text style={styles.trainingStatValue}>
                {stats.totalDays - stats.totalDaysCompleted}
              </Text>
              <Text style={styles.trainingStatLabel}>Remaining</Text>
            </View>
          </View>
        </Card>

        {/* Overall Rank */}
        <Text style={styles.sectionTitle}>Overall Rank</Text>
        <Card style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <View style={[styles.rankTierBadge, { backgroundColor: RANK_INFO.tierColor + '28' }]}>
              <Ionicons name='shield' size={34} color={RANK_INFO.tierColor} />
              <Text style={[styles.rankTierName, { color: RANK_INFO.tierColor }]}>
                {RANK_INFO.tier}
              </Text>
            </View>

            <View style={styles.rankPositionBlock}>
              <Text style={styles.rankNumber}>#{RANK_INFO.rank}</Text>
              <Text style={styles.rankTotal}>
                of {RANK_INFO.totalFighters.toLocaleString()} fighters
              </Text>
              <View style={styles.topPercentBadge}>
                <Text style={styles.topPercentText}>Top {topPercent}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>{RANK_INFO.points.toLocaleString()} XP</Text>
            <Text style={styles.xpLabel}>
              {RANK_INFO.pointsToNext.toLocaleString()} to {RANK_INFO.nextTier}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${rankPercent * 100}%`, backgroundColor: RANK_INFO.tierColor },
              ]}
            />
          </View>

          <View style={styles.tiersRow}>
            {RANK_TIERS.map((tier) => {
              const isActive = tier.name === RANK_INFO.tier;
              return (
                <View key={tier.name} style={styles.tierItem}>
                  <View
                    style={[
                      styles.tierDot,
                      { backgroundColor: tier.color },
                      isActive && styles.tierDotActive,
                    ]}
                  />
                  <Text style={[styles.tierLabel, isActive && { color: tier.color }]}>
                    {tier.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.achievementsRow}>
            {([] as { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }[])
              .concat([
                { icon: 'trophy', label: 'First Win', color: Colors.secondary },
                { icon: 'flame', label: 'On Fire', color: Colors.primary },
                { icon: 'star', label: 'Top User', color: Colors.info },
                { icon: 'diamond', label: 'Premium', color: Colors.success },
              ])
              .map((badge) => (
                <View key={badge.label} style={styles.achievementBadge}>
                  <View style={[styles.achievementIcon, { backgroundColor: badge.color + '22' }]}>
                    <Ionicons name={badge.icon} size={26} color={badge.color} />
                  </View>
                  <Text style={styles.achievementLabel}>{badge.label}</Text>
                </View>
              ))}
          </View>
        </ScrollView>

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
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  name: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  email: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  bio: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeightBase,
    marginBottom: Spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  // Training Progress
  progressCard: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressInfo: {
    flex: 1,
  },
  progressPhase: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  progressWeek: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressDaysBadge: {
    backgroundColor: Colors.primary + '22',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  progressDaysText: {
    fontSize: Typography.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radii.full,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  progressCaption: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  trainingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  trainingStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  trainingStatValue: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  trainingStatLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  trainingStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  // Overall Rank
  rankCard: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  rankTierBadge: {
    width: 84,
    height: 84,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  rankTierName: {
    fontSize: Typography.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rankPositionBlock: {
    flex: 1,
    gap: 4,
  },
  rankNumber: {
    fontSize: Typography.xxxl,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: Typography.xxxl * 1.1,
  },
  rankTotal: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  topPercentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '22',
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: 4,
  },
  topPercentText: {
    fontSize: Typography.xs,
    fontWeight: '700',
    color: Colors.success,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  tiersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  tierItem: {
    alignItems: 'center',
    gap: 4,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.5,
  },
  tierDotActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 1,
  },
  tierLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  // Achievements
  achievementsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    paddingRight: Spacing.md,
  },
  achievementBadge: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  achievementLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
