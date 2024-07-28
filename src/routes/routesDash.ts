import IRoutes from './IRoutes';
import Home from '../pages/Dashboard/Home';
import FieldAvailabilities from '../pages/Dashboard/FieldAvailabilities';

const routesDash: IRoutes[] = [
	{
		path: '/dashboard',
		component: Home,
		visibleInDisplay: false,
		displayName: 'Home',
		protected: true,
		adminOnly: true,
	},
	{
		path: '/field-availabilities',
		component: FieldAvailabilities,
		visibleInDisplay: true,
		displayName: 'Disponibilidades de campo',
		protected: true,
		adminOnly: true,
	},
];

export default routesDash;
