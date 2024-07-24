import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
	children: React.ReactNode;
	path: string;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { user, isLoading, token } = useAuth();

	// se o usuario não fez login, e o loading terminou.
	if (!user && !isLoading) {
		return <Navigate to='/auth/signin' />;
	}

	// se usuario tiver logado, e o loading tiver terminado, porem não ativou seu cadastro
	if (user && !isLoading && !user?.email_verified_at) {
		return <Navigate to='/auth/activate-account' />;
	}

	// se chegou aqui é porque usuario fez login, e aqui verifica se loading terminou
	if (!isLoading) {
		return <>{children}</>;
	}

	// verifica se está carregando e se não usuario não fez logi, e se não tem token
	if (isLoading && !user && !token) {
		return <div>Loading...</div>;
	}
};
