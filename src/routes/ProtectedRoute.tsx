import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
	children: React.ReactNode;
	path: string;
}

export const ProtectedRoute = ({ children, path }: ProtectedRouteProps) => {
	const { user, isLoading, token } = useAuth();
	if (!user && !isLoading) {
		return <Navigate to='/signin' />;
	}

	if (
		user &&
		!isLoading &&
		!user.isEmailVerified &&
		path.includes('/dashboard') &&
		path !== '/dashboard/resend-activation-link'
	) {
		return <Navigate to='/dashboard/resend-activation-link' />;
	}

	if (!isLoading) {
		return <>{children}</>;
	}

	if (isLoading && !user && !token) {
		return <div>Loading...</div>;
	}
};
