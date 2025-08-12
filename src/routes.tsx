import { RouteProps } from 'react-router';
import { Root } from '@/pages/root';
import { MapDemo } from '@/pages/map';
import { MapEditor } from '@/pages/map-editor';

export const routes: RouteProps[] = [
	{
		path: '/',
		element: <Root />,
	},
	{
		path: '/map',
		element: <MapDemo />,
	},
	{
		path: '/map-editor',
		element: <MapEditor />,
	},
	{
		path: '/*',
		element: null,
	},
];
