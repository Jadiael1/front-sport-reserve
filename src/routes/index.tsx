import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

function AppRoutes() {
	const { isLoading } = useAuth();
	return (
		<BrowserRouter>
			<Routes>
				{routes.map(({ path, component: Component, protected: isProtected }) => {
					return (
						<Route
							key={path}
							path={path}
							element={
								isProtected ?
									<ProtectedRoute path={path}>
										<Component />
									</ProtectedRoute>
								: !isLoading ?
									<Component />
								:	<div>Loading...</div>
							}
						/>
					);
				})}
				<Route
					path='*'
					element={<Navigate to='/' />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
