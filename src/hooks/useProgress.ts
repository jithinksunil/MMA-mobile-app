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
  completeExercise: (exerciseId: string) => Promise<void>;
  completeDay: (dayId: string) => Promise<void>;
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
    isStringArray(parsed.completedExercises)
  ) {
    return {
      completedDays: parsed.completedDays,
      completedExercises: parsed.completedExercises,
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
    (exerciseId: string): ExerciseStatus =>
      completedExercisesSet.has(exerciseId) ? 'completed' : 'pending',
    [completedExercisesSet],
  );

  const completeExercise = useCallback(
    async (exerciseId: string): Promise<void> => {
      if (progress.completedExercises.includes(exerciseId)) return;
      await save({
        ...progress,
        completedExercises: [...progress.completedExercises, exerciseId],
      });
    },
    [progress, save],
  );

  const completeDay = useCallback(
    async (dayId: string): Promise<void> => {
      if (progress.completedDays.includes(dayId)) return;
      const entry = ALL_DAYS.find((d) => d.dayId === dayId);
      const phase = entry ? CURRICULUM.find((p) => p.id === entry.phaseId) : undefined;
      const day = phase?.days.find((d) => d.id === dayId);
      const allExerciseIds = day?.sections.flatMap((s) => s.exercises.map((e) => e.id)) ?? [];
      const newExerciseIds = allExerciseIds.filter(
        (id) => !progress.completedExercises.includes(id),
      );
      await save({
        completedDays: [...progress.completedDays, dayId],
        completedExercises: [...progress.completedExercises, ...newExerciseIds],
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
    completeExercise,
    completeDay,
    resetProgress,
    stats,
  };
}

export type { UseProgressReturn };
