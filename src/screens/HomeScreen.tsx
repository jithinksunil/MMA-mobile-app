import type React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProgressContext } from '../context/ProgressContext';
import { CURRICULUM } from '../data/curriculum';
import { Colors, Spacing, Typography, Radii, Shadows } from '../theme';
import { Card } from '../components';
import { type RootStackParamList, type Phase } from '../types';

const HERO_LABEL_COLOR = 'rgba(255,255,255,0.7)';
const HERO_SUBTITLE_COLOR = 'rgba(255,255,255,0.75)';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;
type PhaseStatus = 'completed' | 'active' | 'locked';

interface PhaseCardProps {
  phase: Phase;
  index: number;
  status: PhaseStatus;
  daysCompleted: number;
  onPress: () => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, index, status, daysCompleted, onPress }) => {
  const isNavigable = status !== 'locked';
  const progressPercent = phase.days.length > 0 ? daysCompleted / phase.days.length : 0;

  return (
    <Card
      style={styles.phaseCard}
      onPress={isNavigable ? onPress : undefined}
      elevated={isNavigable}
    >
      <View style={styles.phaseCardHeader}>
        <View
          style={[
            styles.phaseNumberCircle,
            status === 'completed' && styles.phaseNumberCircleCompleted,
          ]}
        >
          {status === 'completed' ? (
            <Ionicons name='checkmark' size={22} color={Colors.success} />
          ) : (
            <Text style={styles.phaseNumber}>{index + 1}</Text>
          )}
        </View>
        <View style={styles.phaseMeta}>
          <Text style={styles.phaseTitle}>{phase.title}</Text>
          <Text style={styles.phaseWeekRange}>{phase.weekRange}</Text>
        </View>
        <View
          style={[
            styles.phaseBadge,
            status === 'active' && styles.phaseBadgeActive,
            status === 'completed' && styles.phaseBadgeCompleted,
            status === 'locked' && styles.phaseBadgeLocked,
          ]}
        >
          {status === 'locked' && (
            <Ionicons
              name='lock-closed'
              size={10}
              color={Colors.textMuted}
              style={styles.badgeLockIcon}
            />
          )}
          {status === 'completed' && (
            <Ionicons
              name='checkmark'
              size={10}
              color={Colors.success}
              style={styles.badgeLockIcon}
            />
          )}
          <Text
            style={[
              styles.phaseBadgeText,
              status === 'active' && styles.phaseBadgeTextActive,
              status === 'completed' && styles.phaseBadgeTextCompleted,
              status === 'locked' && styles.phaseBadgeTextLocked,
            ]}
          >
            {status === 'active' ? 'ACTIVE' : status === 'completed' ? 'DONE' : 'LOCKED'}
          </Text>
        </View>
      </View>
      {status === 'active' && (
        <>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
          </View>
          <View style={styles.phaseCardFooter}>
            <Text style={styles.daysLabel}>
              {daysCompleted} of {phase.days.length} sessions complete
            </Text>
            <Ionicons name='chevron-forward' size={16} color={Colors.primary} />
          </View>
        </>
      )}
      {status === 'completed' && (
        <View style={styles.phaseCardFooter}>
          <Text style={styles.daysLabel}>{phase.days.length} sessions complete</Text>
          <Ionicons name='chevron-forward' size={16} color={Colors.textMuted} />
        </View>
      )}
    </Card>
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const { getDayStatus } = useProgressContext();

  const getPhaseStatus = (phase: Phase): PhaseStatus => {
    const statuses = phase.days.map((d) => getDayStatus(d.id));
    if (statuses.every((s) => s === 'completed')) return 'completed';
    if (statuses.some((s) => s === 'active')) return 'active';
    return 'locked';
  };

  const getPhaseDaysCompleted = (phase: Phase): number =>
    phase.days.filter((d) => getDayStatus(d.id) === 'completed').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Start your training</Text>
            <Text style={styles.username}>Your MMA Journey</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name='notifications-outline' size={24} color={Colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>TRAINING PROGRAM</Text>
            <Text style={styles.heroTitle}>Build Your{'\n'}Foundation</Text>
            <Text style={styles.heroSubtitle}>
              Structured MMA training from beginner to advanced.
            </Text>
          </View>
          <View style={styles.heroDecoration}>
            <Ionicons name='barbell' size={80} color={HERO_LABEL_COLOR} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Training Phases</Text>
        {CURRICULUM.map((phase, index) => {
          const status = getPhaseStatus(phase);
          return (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              status={status}
              daysCompleted={getPhaseDaysCompleted(phase)}
              onPress={() => {
                navigation.navigate('PhaseDetail', { phaseId: phase.id });
              }}
            />
          );
        })}

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
    borderRadius: Radii.full,
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
    color: HERO_LABEL_COLOR,
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
    color: HERO_SUBTITLE_COLOR,
    lineHeight: Typography.lineHeightBase,
  },
  heroDecoration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  phaseCard: {
    marginBottom: Spacing.sm,
  },
  phaseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseNumberCircle: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  phaseNumberCircleCompleted: {
    backgroundColor: Colors.success + '22',
  },
  phaseNumber: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.primary,
  },
  phaseMeta: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  phaseWeekRange: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
  },
  phaseBadgeActive: {
    backgroundColor: Colors.primary + '33',
  },
  phaseBadgeCompleted: {
    backgroundColor: Colors.success + '22',
  },
  phaseBadgeLocked: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeLockIcon: {
    marginRight: 3,
  },
  phaseBadgeText: {
    fontSize: Typography.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  phaseBadgeTextActive: {
    color: Colors.primary,
  },
  phaseBadgeTextCompleted: {
    color: Colors.success,
  },
  phaseBadgeTextLocked: {
    color: Colors.textMuted,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  phaseCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  daysLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
