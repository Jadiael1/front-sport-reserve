import Home from '../components/Home/index';
import FieldDetails from '../components/FieldDetails/index';
import IRoutes from './IRoutes';
import ReservationList from '../components/ReservationList';
import FieldForm from '../components/FieldStore';
import FieldUpdate from '../components/FieldUpdate';

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
	{
		path: '/fields/new',
		component: FieldForm,
		visibleInDisplay: true,
		displayName: 'Novo Campo',
		protected: true,
	},
	{
		path: '/fields/edit/:id',
		component: FieldUpdate,
		visibleInDisplay: false,
		displayName: 'Editar Campo',
		protected: true,
	},
];

export default routesSite;
