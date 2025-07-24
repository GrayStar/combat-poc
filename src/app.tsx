import { BrowserRouter, Route, Routes } from 'react-router';
import { GlobalStyles } from 'tss-react';
import { routes } from '@/routes';
import { getGlobalStyles } from '@/styles';
import { ThemeProvider } from '@/styles/contexts';
import { useTheme } from '@/styles/hooks';

const AppWithProviders = () => {
	const { theme } = useTheme();

	return (
		<>
			<GlobalStyles styles={getGlobalStyles(theme)} />
			<Routes>
				{routes.map(({ ...route }) => (
					<Route {...route} />
				))}
			</Routes>
		</>
	);
};

const App = () => {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AppWithProviders />
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default App;
