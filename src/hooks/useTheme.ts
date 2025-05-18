import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const set = (newMode: 'light' | 'dark') => {
    dispatch(setTheme(newMode));
  };

  return {
    mode,
    toggle,
    set,
    isDark: mode === 'dark',
  };
};