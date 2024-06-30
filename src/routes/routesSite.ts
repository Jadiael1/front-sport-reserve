import Home from '../components/Home/index';
import FieldDetails from '../components/FieldDetails/index';
import IRoutes from './IRoutes';
import ReservationList from '../components/ReservationList';

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
		protected: true,
	},
	{
		path: '/reservations',
		component: ReservationList,
		visibleInDisplay: true,
		displayName: 'Reservations',
		protected: true,
	},
];

export default routesSite;
