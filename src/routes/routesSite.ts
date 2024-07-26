import Home from '../pages/Home/index';
import FieldDetails from '../pages/FieldDetails/index';
import IRoutes from './IRoutes';
import ReservationList from '../pages/ReservationList';
import FieldForm from '../pages/FieldStore';
import FieldUpdate from '../pages/FieldUpdate';

const routesSite: IRoutes[] = [
	{
		path: '/',
		component: Home,
		visibleInDisplay: true,
		displayName: 'Home',
		protected: false,
		adminOnly: false,
	},
	{
		path: '/field/:id',
		component: FieldDetails,
		visibleInDisplay: false,
		displayName: 'Home',
		protected: true,
		adminOnly: false,
	},
	{
		path: '/reservations',
		component: ReservationList,
		visibleInDisplay: true,
		displayName: 'Reservations',
		protected: true,
		adminOnly: false,
	},
	{
		path: '/fields/new',
		component: FieldForm,
		visibleInDisplay: true,
		displayName: 'Novo Campo',
		protected: true,
		adminOnly: true,
	},
	{
		path: '/fields/edit/:id',
		component: FieldUpdate,
		visibleInDisplay: false,
		displayName: 'Editar Campo',
		protected: true,
		adminOnly: true,
	},
];

export default routesSite;
