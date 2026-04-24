// Navigation param types
export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Details: { id: string; title: string };
  Profile: undefined;
  Settings: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
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
