import { useTheme } from './useTheme';
import { themeConfig } from '../utils/theme.config';
import type { ColorScheme } from '../utils/theme.config';

export const useThemeColors = () => {
  const { mode } = useTheme();
  const colors: ColorScheme = themeConfig[mode];

  return colors;
};