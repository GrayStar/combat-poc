import { createContext } from 'react';
import { defaultTheme as theme, ThemeConfig } from '@/styles/themes';

interface ThemeContextConfig {
	theme: ThemeConfig;
	setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}

export const ThemeContext = createContext<ThemeContextConfig>({
	theme,
	setTheme: () => {},
});
