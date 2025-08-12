import { RouteProps } from 'react-router';
import { Root } from '@/pages/root';
import { MapDemo } from '@/pages/map';

export const routes: RouteProps[] = [
	{
		path: '/',
		element: <Root />,
	},
	{
		path: '/map',
		element: <MapDemo />,
	},
];
