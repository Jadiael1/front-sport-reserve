// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LogoutButton = () => {
	const { logout } = useAuth();
	// const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		// navigate('/signin');
	};

	return (
		<button
			onClick={handleLogout}
			className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300'
		>
			Logout
		</button>
	);
};

export default LogoutButton;
