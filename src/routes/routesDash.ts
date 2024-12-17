import IRoutes from './IRoutes';
import Home from '../pages/Dashboard/Home';
import FieldAvailabilities from '../pages/Dashboard/FieldAvailabilities';
import { AiOutlineFieldTime } from 'react-icons/ai';
import Users from '../pages/Dashboard/Users';
import { FaUserCircle, FaChartLine, FaCreditCard, FaPrint } from 'react-icons/fa';
import Reports from '../pages/Dashboard/Reports';
import Payments from '../pages/Dashboard/Payments';
import ReservationFilterPage from '../pages/Dashboard/PrintReservations';

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
		path: '/dashboard/field-availabilities',
		component: FieldAvailabilities,
		visibleInDisplay: true,
		displayName: 'Disponibilidades de campo',
		protected: true,
		adminOnly: true,
		icon: AiOutlineFieldTime,
	},
	{
		path: '/dashboard/users',
		component: Users,
		visibleInDisplay: true,
		displayName: 'Usuarios',
		protected: true,
		adminOnly: true,
		icon: FaUserCircle,
	},
	{
		path: '/dashboard/reports',
		component: Reports,
		visibleInDisplay: true,
		displayName: 'Relatórios',
		protected: true,
		adminOnly: true,
		icon: FaChartLine,
	},
	{
		path: '/dashboard/payments',
		component: Payments,
		visibleInDisplay: true,
		displayName: 'Pagamentos',
		protected: true,
		adminOnly: true,
		icon: FaCreditCard,
	},
	{
		path: '/dashboard/print-reservations',
		component: ReservationFilterPage,
		visibleInDisplay: true,
		displayName: 'Imprimir Reservas',
		protected: true,
		adminOnly: true,
		icon: FaPrint,
	},
];

export default routesDash;
