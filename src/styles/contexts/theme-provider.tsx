import { PropsWithChildren, useState } from 'react';
import { TssCacheProvider } from 'tss-react';
import createCache from '@emotion/cache';
import { defaultTheme } from '@/styles/themes';
import { ThemeContext } from '@/styles/contexts/theme-context';

const tssCache = createCache({ key: 'css', prepend: true });

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [theme, setTheme] = useState(defaultTheme);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<TssCacheProvider value={tssCache}>{children}</TssCacheProvider>
		</ThemeContext.Provider>
	);
};
