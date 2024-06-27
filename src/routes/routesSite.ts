import Home from '../components/Home/index';
import FieldDetails from '../components/FieldDetails/index';
import IRoutes from './IRoutes';

const routesSite: IRoutes[] = [
	{
		path: '/',
		component: Home,
		visibleInDisplay: true,
		displayName: 'Home',
		protected: false,
	},
	{
		path: '/field/:id',
		component: FieldDetails,
		visibleInDisplay: true,
		displayName: 'Home',
		protected: false,
	},
];

export default routesSite;
