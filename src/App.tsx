import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import './assets/main.css';
import { APIProvider } from '@vis.gl/react-google-maps';
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App: React.FC = () => {
	return (
		<AuthProvider>
			<APIProvider
				apiKey={googleMapsApiKey}
				language='pt'
				region='BR'
				libraries={['maps']}
			>
				<AppRoutes />
			</APIProvider>
		</AuthProvider>
	);
};

export default App;
