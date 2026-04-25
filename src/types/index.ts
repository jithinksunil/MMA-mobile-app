// Navigation param types
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Details: { id: string; title: string };
  Profile: undefined;
  Settings: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  PhaseDetail: { phaseId: string };
  DayDetail: { phaseId: string; dayId: string };
  VideoPlayer: {
    videoUrl: string;
    exerciseTitle: string;
    description?: string;
    instructions?: string[];
    duration?: string;
    rounds?: number;
  };
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BottomTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

// Common data types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Curriculum types
export interface Exercise {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
  instructions?: string[];
  duration?: string;
  rounds?: number;
}

export interface Section {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface TrainingDay {
  id: string;
  dayName: string;
  sections: Section[];
}

export interface Phase {
  id: string;
  title: string;
  weekRange: string;
  days: TrainingDay[];
}
