import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import './assets/main.css';

const App: React.FC = () => {
	return (
		<AuthProvider>
			<AppRoutes />
		</AuthProvider>
	);
};

export default App;
