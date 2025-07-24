import { useContext } from 'react';
import { ThemeContext } from '@/styles/contexts/theme-context';

export const useTheme = () => useContext(ThemeContext);
