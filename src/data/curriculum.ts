import { type Phase, type TrainingDay } from '../types';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SECTION_TITLES = ['Warmup', 'Functional', 'Cooldown'];
const CHAPTER_COUNT = 10;

function stubDay(phasePrefix: string, dayName: string): TrainingDay {
  const dayKey = dayName.toLowerCase().slice(0, 3);
  return {
    id: `${phasePrefix}-day-${dayKey}`,
    dayName,
    sections: SECTION_TITLES.map((title) => ({
      id: `${phasePrefix}-day-${dayKey}-${title.toLowerCase()}`,
      title,
      exercises: [
        {
          id: `${phasePrefix}-day-${dayKey}-${title.toLowerCase()}-ex1`,
          title: 'Coming Soon',
          videoUrl: '',
        },
      ],
    })),
  };
}

const chapter1Day1: TrainingDay = {
  id: 'phase-1-day-mon',
  dayName: 'Monday',
  sections: [
    {
      id: 'phase-1-day-mon-warmup',
      title: 'Warmup',
      exercises: [
        {
          id: 'phase-1-day-mon-warmup-jab-and-cross',
          title: 'Jab and Cross',
          videoUrl:
            'https://res.cloudinary.com/df8w69xon/video/upload/v1777106097/How_to_Throw_the_Perfect_Jab_in_Boxing_fbl6yt.mp4',
          duration: '3min',
          rounds: 8,
          description:
            'The jab and cross are the two most fundamental punches in combat sports. The jab sets up attacks and controls distance, while the cross delivers maximum power from the rear hand.',
          instructions: [
            'Start in your fighting stance: feet shoulder-width apart, dominant foot back, hands up by your chin.',
            'Jab — extend your lead hand straight out, rotating your fist so the palm faces down at full extension. Snap it back immediately.',
            'Cross — pivot on your rear foot, rotate your hips and shoulders, and drive your rear hand straight forward. Rotate the fist palm-down at the end.',
            'Combine them into a 1-2: throw the jab first to close distance, then follow immediately with the cross for power.',
            'Keep your chin tucked and your non-punching hand protecting your face throughout.',
          ],
        },
      ],
    },
    {
      id: 'phase-1-day-mon-functional',
      title: 'Functional',
      exercises: [{ id: 'phase-1-day-mon-functional-ex1', title: 'Coming Soon', videoUrl: '' }],
    },
    {
      id: 'phase-1-day-mon-cooldown',
      title: 'Cooldown',
      exercises: [{ id: 'phase-1-day-mon-cooldown-ex1', title: 'Coming Soon', videoUrl: '' }],
    },
  ],
};

function buildChapter(index: number): Phase {
  const phaseId = `phase-${index}`;
  const days =
    index === 1
      ? [chapter1Day1, ...DAYS_OF_WEEK.slice(1).map((day) => stubDay(phaseId, day))]
      : DAYS_OF_WEEK.map((day) => stubDay(phaseId, day));
  return {
    id: phaseId,
    title: `Chapter ${index}`,
    weekRange: `Week ${index}`,
    days,
  };
}

export const CURRICULUM: Phase[] = Array.from({ length: CHAPTER_COUNT }, (_, i) =>
  buildChapter(i + 1),
);

export function getPhaseById(phaseId: string): Phase | undefined {
  return CURRICULUM.find((p) => p.id === phaseId);
}

export function getDayById(phaseId: string, dayId: string): TrainingDay | undefined {
  return getPhaseById(phaseId)?.days.find((d) => d.id === dayId);
}
