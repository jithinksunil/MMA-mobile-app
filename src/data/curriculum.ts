import { type Phase, type TrainingDay } from '../types';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SECTION_TITLES = ['Warmup', 'Functional', 'Cooldown'];

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

export const CURRICULUM: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1',
    weekRange: 'Weeks 1–3',
    days: [
      {
        id: 'phase-1-day-mon',
        dayName: 'Monday',
        sections: [
          {
            id: 'phase-1-day-mon-warmup',
            title: 'Warmup',
            exercises: [
              {
                id: 'phase-1-day-mon-warmup-torso',
                title: 'Torso',
                videoUrl:
                  'https://res.cloudinary.com/df8w69xon/video/upload/v1777106097/How_to_Throw_the_Perfect_Jab_in_Boxing_fbl6yt.mp4',
              },
            ],
          },
          {
            id: 'phase-1-day-mon-functional',
            title: 'Functional',
            exercises: [
              { id: 'phase-1-day-mon-functional-ex1', title: 'Coming Soon', videoUrl: '' },
            ],
          },
          {
            id: 'phase-1-day-mon-cooldown',
            title: 'Cooldown',
            exercises: [{ id: 'phase-1-day-mon-cooldown-ex1', title: 'Coming Soon', videoUrl: '' }],
          },
        ],
      },
      ...DAYS_OF_WEEK.slice(1).map((day) => stubDay('phase-1', day)),
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2',
    weekRange: 'Weeks 4–6',
    days: DAYS_OF_WEEK.map((day) => stubDay('phase-2', day)),
  },
  {
    id: 'phase-3',
    title: 'Phase 3',
    weekRange: 'Weeks 7–9',
    days: DAYS_OF_WEEK.map((day) => stubDay('phase-3', day)),
  },
];

export function getPhaseById(phaseId: string): Phase | undefined {
  return CURRICULUM.find((p) => p.id === phaseId);
}

export function getDayById(phaseId: string, dayId: string): TrainingDay | undefined {
  return getPhaseById(phaseId)?.days.find((d) => d.id === dayId);
}
