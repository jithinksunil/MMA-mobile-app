import type React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import { Colors, Spacing, Typography, Radii } from '../theme';
import { Card } from '../components';
import { getPhaseById } from '../data/curriculum';
import { type RootStackParamList, type TrainingDay } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhaseDetail'>;

interface DayCardProps {
  day: TrainingDay;
  index: number;
  onPress: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, index, onPress }) => {
  const totalExercises = day.sections.reduce((acc, s) => acc + s.exercises.length, 0);
  return (
    <Card style={styles.dayCard} onPress={onPress} elevated>
      <View style={styles.dayCardContent}>
        <View style={styles.dayNumberCircle}>
          <Text style={styles.dayNumber}>{index + 1}</Text>
        </View>
        <View style={styles.dayInfo}>
          <Text style={styles.dayName}>{day.dayName}</Text>
          <Text style={styles.daySummary}>
            {day.sections.length} sections · {totalExercises} exercises
          </Text>
        </View>
        <Ionicons name='chevron-forward' size={18} color={Colors.textMuted} />
      </View>
    </Card>
  );
};

export const PhaseDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phaseId } = route.params;
  const phase = getPhaseById(phaseId);

  if (!phase) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.errorText}>Phase not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name='arrow-back' size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{phase.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.metaBanner}>
        <Ionicons name='calendar-outline' size={18} color={Colors.primary} />
        <Text style={styles.metaWeek}>{phase.weekRange}</Text>
        <Text style={styles.metaDays}>{phase.days.length} Training Days</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Weekly Schedule</Text>
        {phase.days.map((day, index) => (
          <DayCard
            key={day.id}
            day={day}
            index={index}
            onPress={() => navigation.navigate('DayDetail', { phaseId, dayId: day.id })}
          />
        ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  metaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaWeek: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  metaDays: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  dayCard: {
    marginBottom: Spacing.sm,
  },
  dayCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayNumberCircle: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  dayNumber: {
    fontSize: Typography.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  daySummary: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: Typography.base,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
