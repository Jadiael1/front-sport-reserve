import IRoutes from './IRoutes';
import Signup from '../components/SignUp/index';
import SignIn from '../components/SignIn/index';
import AccountActivationReminder from '../components/AccountActivationReminder/index';
import EmailVerification from '../components/EmailVerification/index';
import ForgotPasswordPage from '../components/ForgotPassword';
import ResetPasswordPage from '../components/ResetPassword';

const routesAuth: IRoutes[] = [
	{
		path: '/signin',
		component: SignIn,
		visibleInDisplay: false,
		displayName: 'Login',
		protected: false,
	},
	{
		path: '/signup',
		component: Signup,
		visibleInDisplay: false,
		displayName: 'Registrar',
		protected: false,
	},
	{
		path: '/activate-account',
		component: AccountActivationReminder,
		visibleInDisplay: true,
		displayName: 'Home',
		protected: false,
	},
	{
		path: '/auth/email/verify',
		component: EmailVerification,
		visibleInDisplay: true,
		displayName: 'Home',
		protected: false,
	},
	{
		path: '/forgot-password',
		component: ForgotPasswordPage,
		visibleInDisplay: false,
		displayName: 'Forgot Password',
		protected: false,
	},
	{
		path: '/auth/reset-password',
		component: ResetPasswordPage,
		visibleInDisplay: false,
		displayName: 'Reset Password',
		protected: false,
	},
];

export default routesAuth;
