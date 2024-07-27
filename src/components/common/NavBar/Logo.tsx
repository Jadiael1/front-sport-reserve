import { useNavigate } from 'react-router-dom';
import { IoMdFootball } from 'react-icons/io';

const Logo = () => {
	const navigate = useNavigate();
	return (
		<a
			onClick={(evt: React.MouseEvent<HTMLAnchorElement>) => {
				evt.preventDefault();
				navigate('/');
			}}
			href='/'
			className='flex items-center mr-6 ml-2 sm:ml-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
			aria-label='Go to homepage'
		>
			<IoMdFootball className='h-8 w-8 text-blue-700' />
			<span className='self-center font-semibold text-sm sm:text-lg ml-2 text-blue-700'>SportReserve</span>
		</a>
	);
};

export default Logo;
