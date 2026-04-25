import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CURRICULUM } from '../data/curriculum';
import type { DayStatus, ExerciseStatus, ProgressStats, StoredProgress } from '../types';

const STORAGE_KEY = '@mma_progress_v1';

const ALL_DAYS: readonly { readonly phaseId: string; readonly dayId: string }[] =
  CURRICULUM.flatMap((phase) => phase.days.map((day) => ({ phaseId: phase.id, dayId: day.id })));

const INITIAL_PROGRESS: StoredProgress = {
  completedDays: [],
  completedExercises: [],
  partiallyWatchedExercises: [],
};

const ALL_EXERCISE_IDS = CURRICULUM.flatMap((phase) =>
  phase.days.flatMap((day) =>
    day.sections.flatMap((section) => section.exercises.map((exercise) => exercise.id)),
  ),
);

interface UseProgressReturn {
  isLoaded: boolean;
  getDayStatus: (dayId: string) => DayStatus;
  getExerciseStatus: (exerciseId: string) => ExerciseStatus;
  recordExercisePlayback: (exerciseId: string, watchedPercent: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  stats: ProgressStats;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseStoredProgress(raw: string): StoredProgress | null {
  const parsed = JSON.parse(raw) as unknown;

  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'completedDays' in parsed &&
    'completedExercises' in parsed &&
    isStringArray(parsed.completedDays) &&
    isStringArray(parsed.completedExercises) &&
    (!('partiallyWatchedExercises' in parsed) || isStringArray(parsed.partiallyWatchedExercises))
  ) {
    return {
      completedDays: parsed.completedDays,
      completedExercises: parsed.completedExercises,
      partiallyWatchedExercises:
        'partiallyWatchedExercises' in parsed && isStringArray(parsed.partiallyWatchedExercises)
          ? parsed.partiallyWatchedExercises
          : [],
    };
  }

  return null;
}

export function useProgress(): UseProgressReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState<StoredProgress>(INITIAL_PROGRESS);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw !== null) {
        try {
          const parsed = parseStoredProgress(raw);
          if (parsed) {
            setProgress(parsed);
          }
        } catch {
          // Corrupted local storage starts fresh; future sync can repair from the server.
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const save = useCallback(async (next: StoredProgress): Promise<void> => {
    setProgress(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const completedDaysSet = useMemo(() => new Set(progress.completedDays), [progress.completedDays]);

  const completedExercisesSet = useMemo(
    () => new Set(progress.completedExercises),
    [progress.completedExercises],
  );

  const partiallyWatchedExercisesSet = useMemo(
    () => new Set(progress.partiallyWatchedExercises),
    [progress.partiallyWatchedExercises],
  );

  const { activeDayId, activePhaseId } = useMemo(() => {
    const entry = ALL_DAYS.find((d) => !completedDaysSet.has(d.dayId));
    return { activeDayId: entry?.dayId ?? null, activePhaseId: entry?.phaseId ?? null };
  }, [completedDaysSet]);

  const getDayStatus = useCallback(
    (dayId: string): DayStatus => {
      if (completedDaysSet.has(dayId)) return 'completed';
      if (dayId === activeDayId) return 'active';
      return 'locked';
    },
    [completedDaysSet, activeDayId],
  );

  const getExerciseStatus = useCallback(
    (exerciseId: string): ExerciseStatus => {
      if (completedExercisesSet.has(exerciseId)) return 'completed';
      if (partiallyWatchedExercisesSet.has(exerciseId)) return 'partiallyWatched';
      return 'notWatched';
    },
    [completedExercisesSet, partiallyWatchedExercisesSet],
  );

  const recordExercisePlayback = useCallback(
    async (exerciseId: string, watchedPercent: number): Promise<void> => {
      const isCompleted = watchedPercent >= 0.9;
      const hasCompletedExercise = progress.completedExercises.includes(exerciseId);
      const hasPartiallyWatchedExercise = progress.partiallyWatchedExercises.includes(exerciseId);

      if (hasCompletedExercise || (!isCompleted && hasPartiallyWatchedExercise)) {
        return;
      }

      const completedExercises = isCompleted
        ? [...progress.completedExercises, exerciseId]
        : progress.completedExercises;
      const partiallyWatchedExercises = isCompleted
        ? progress.partiallyWatchedExercises.filter((id) => id !== exerciseId)
        : [...progress.partiallyWatchedExercises, exerciseId];
      const completedExercisesForDayCheck = new Set(completedExercises);
      const completedDay = CURRICULUM.flatMap((phase) => phase.days).find((day) => {
        const videoExerciseIds = day.sections.flatMap((section) =>
          section.exercises
            .filter((exercise) => Boolean(exercise.videoUrl))
            .map((exercise) => exercise.id),
        );
        return (
          videoExerciseIds.includes(exerciseId) &&
          videoExerciseIds.length > 0 &&
          videoExerciseIds.every((id) => completedExercisesForDayCheck.has(id))
        );
      });
      const completedDays =
        completedDay && !progress.completedDays.includes(completedDay.id)
          ? [...progress.completedDays, completedDay.id]
          : progress.completedDays;

      await save({
        completedDays,
        completedExercises,
        partiallyWatchedExercises,
      });
    },
    [progress, save],
  );

  const resetProgress = useCallback(async (): Promise<void> => {
    await save(INITIAL_PROGRESS);
  }, [save]);

  const stats = useMemo((): ProgressStats => {
    const activePhase = activePhaseId
      ? CURRICULUM.find((p) => p.id === activePhaseId)
      : (CURRICULUM[0] ?? null);
    const activePhaseDays = activePhase?.days ?? [];
    const activePhaseDaysCompleted = activePhaseDays.filter((d) =>
      completedDaysSet.has(d.id),
    ).length;
    return {
      totalDaysCompleted: completedDaysSet.size,
      totalDays: ALL_DAYS.length,
      totalExercisesCompleted: completedExercisesSet.size,
      totalExercises: ALL_EXERCISE_IDS.length,
      activeDayId,
      activePhaseId,
      activePhaseDaysCompleted,
      activePhaseTotalDays: activePhaseDays.length,
      activePhaseTitle: activePhase?.title ?? 'Phase 1',
      activePhaseWeekRange: activePhase?.weekRange ?? 'Weeks 1–3',
      currentStreak: completedDaysSet.size,
    };
  }, [completedDaysSet, completedExercisesSet, activeDayId, activePhaseId]);

  return {
    isLoaded,
    getDayStatus,
    getExerciseStatus,
    recordExercisePlayback,
    resetProgress,
    stats,
  };
}

export type { UseProgressReturn };
