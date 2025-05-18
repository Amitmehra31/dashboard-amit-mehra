export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export enum WidgetType {
  WEATHER = 'weather',
  CRYPTO = 'crypto',
  TASKS = 'tasks',
}

export type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  size: 'sm' | 'md' | 'lg';
  position: number;
  route: string;
};

export type WeatherData = {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
};

export type CryptoData = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  image: string;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type WidgetState = {
  widgets: Widget[];
  isLoading: boolean;
  error: string | null;
};

export type ThemeState = {
  mode: 'light' | 'dark';
};

export type RootState = {
  auth: AuthState;
  widgets: WidgetState;
  theme: ThemeState;
};