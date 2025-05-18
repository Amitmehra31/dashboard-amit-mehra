export const themeConfig = {
  light: {
    primary: {
      main: '#0066FF',
      light: '#3384FF',
      dark: '#0047B3',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#14B8A6',
      light: '#5EEAD4',
      dark: '#0F766E',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8FAFC',
      subtle: '#F1F5F9'
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      disabled: '#94A3B8'
    },
    border: {
      light: '#E2E8F0',
      main: '#CBD5E1',
      dark: '#94A3B8'
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#B45309'
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#B91C1C'
    }
  },
  dark: {
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#14B8A6',
      light: '#2DD4BF',
      dark: '#0D9488',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
      subtle: '#334155'
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      disabled: '#64748B'
    },
    border: {
      light: '#334155',
      main: '#475569',
      dark: '#64748B'
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#B45309'
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#B91C1C'
    }
  }
};

export type ThemeMode = 'light' | 'dark';
export type ColorScheme = typeof themeConfig.light;