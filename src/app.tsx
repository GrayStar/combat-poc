import { BrowserRouter, Link, Route, Routes } from 'react-router';
import { GlobalStyles } from 'tss-react';
import { routes } from '@/routes';
import { getGlobalStyles } from '@/styles';
import { ThemeProvider } from '@/styles/contexts';
import { useTheme } from '@/styles/hooks';
import { Container, Nav, Navbar } from 'react-bootstrap';

const AppWithProviders = () => {
	const { theme } = useTheme();

	return (
		<>
			<GlobalStyles styles={getGlobalStyles(theme)} />

			<Navbar>
				<Container>
					<Nav>
						<Nav.Link as={Link} to="/">
							battle
						</Nav.Link>
						<Nav.Link as={Link} to="/map">
							map
						</Nav.Link>
						<Nav.Link as={Link} to="/map-editor">
							map editor
						</Nav.Link>
					</Nav>
				</Container>
			</Navbar>

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
