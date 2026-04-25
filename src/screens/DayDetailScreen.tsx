import type React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Card } from '../components';
import { useProgressContext } from '../context/ProgressContext';
import { getDayById } from '../data/curriculum';
import { Colors, Spacing, Typography, Radii } from '../theme';
import {
  type Exercise,
  type ExerciseStatus,
  type RootStackParamList,
  type Section,
} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DayDetail'>;

interface ExerciseRowProps {
  exercise: Exercise;
  status: ExerciseStatus;
  onPress: () => void;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({ exercise, status, onPress }) => (
  <Card style={styles.exerciseRow} onPress={exercise.videoUrl ? onPress : undefined}>
    <View style={styles.exerciseContent}>
      <View style={styles.exerciseThumb}>
        {exercise.videoUrl ? (
          <Ionicons name='play-circle' size={28} color={Colors.primary} />
        ) : (
          <Ionicons name='lock-closed' size={22} color={Colors.textMuted} />
        )}
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{exercise.title}</Text>
        <Text
          style={[styles.exerciseStatus, status === 'completed' && styles.exerciseStatusCompleted]}
        >
          {status === 'completed' ? 'Completed' : 'Pending'}
        </Text>
        {exercise.duration && exercise.rounds ? (
          <Text style={styles.exerciseMeta}>
            {exercise.duration} x {exercise.rounds} rounds
          </Text>
        ) : (
          <Text style={styles.exerciseHint}>
            {exercise.videoUrl ? 'Tap to watch' : 'Coming soon'}
          </Text>
        )}
      </View>
      {Boolean(exercise.videoUrl) && (
        <Ionicons name='chevron-forward' size={16} color={Colors.textMuted} />
      )}
    </View>
  </Card>
);

interface SectionGroupProps {
  section: Section;
  getExerciseStatus: (exerciseId: string) => ExerciseStatus;
  onExercisePress: (exercise: Exercise) => void;
}

const SectionGroup: React.FC<SectionGroupProps> = ({
  section,
  getExerciseStatus,
  onExercisePress,
}) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.exerciseCount}>{section.exercises.length} exercises</Text>
    </View>
    {section.exercises.map((exercise) => (
      <ExerciseRow
        key={exercise.id}
        exercise={exercise}
        status={getExerciseStatus(exercise.id)}
        onPress={() => {
          onExercisePress(exercise);
        }}
      />
    ))}
  </View>
);

export const DayDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phaseId, dayId } = route.params;
  const { completeDay, getDayStatus, getExerciseStatus } = useProgressContext();
  const day = getDayById(phaseId, dayId);
  const dayStatus = getDayStatus(dayId);

  const handleExercisePress = (exercise: Exercise) => {
    if (!exercise.videoUrl) {
      return;
    }
    navigation.navigate('VideoPlayer', {
      videoUrl: exercise.videoUrl,
      exerciseTitle: exercise.title,
      description: exercise.description,
      instructions: exercise.instructions,
      duration: exercise.duration,
      rounds: exercise.rounds,
      exerciseId: exercise.id,
    });
  };

  const handleCompleteDay = () => {
    void completeDay(dayId);
  };

  if (!day) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.errorText}>Day not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name='arrow-back' size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{day.dayName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {day.sections.map((section) => (
          <SectionGroup
            key={section.id}
            section={section}
            getExerciseStatus={getExerciseStatus}
            onExercisePress={handleExercisePress}
          />
        ))}
        <Button
          title={dayStatus === 'completed' ? 'Day Completed' : 'Mark Day Complete'}
          onPress={handleCompleteDay}
          disabled={dayStatus === 'completed'}
          variant={dayStatus === 'completed' ? 'outline' : 'primary'}
          style={styles.completeDayButton}
        />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  sectionContainer: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    flex: 1,
    fontSize: Typography.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  exerciseCount: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  exerciseRow: {
    marginBottom: Spacing.xs,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseThumb: {
    width: 56,
    height: 56,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  exerciseHint: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  exerciseMeta: {
    fontSize: Typography.xs,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  exerciseStatus: {
    fontSize: Typography.xs,
    color: Colors.warning,
    marginTop: 2,
  },
  exerciseStatusCompleted: {
    color: Colors.success,
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
  completeDayButton: {
    marginTop: Spacing.sm,
  },
});
