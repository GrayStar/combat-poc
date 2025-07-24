import { createTss } from 'tss-react';
import { useTheme } from '@/styles/hooks/use-theme';

export * from './global-styles';
export const { tss } = createTss({ useContext: () => useTheme().theme });
