import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
	return (
		<footer className='bg-slate-200 py-4 py-4 mt-auto flex justify-center'>
			<div className='container'>
				<hr className='border-t-2 border-slate-300' />
				<div className='max-w-6xl mx-auto px-4 mt-2'>
					<div className='flex justify-between items-center'>
						<p className='text-sm text-black'>
							&copy; {new Date().getFullYear()} - Reserva de Quadras Esportivas. Todos os direitos reservados.
						</p>
						<div className='flex space-x-4 text-black'>
							<a
								href='https://facebook.com'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaFacebook className='text-2xl hover:text-blue-600' />
							</a>
							<a
								href='https://instagram.com'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaInstagram className='text-2xl hover:text-pink-500' />
							</a>
							<a
								href='https://twitter.com'
								target='_blank'
								rel='noopener noreferrer'
							>
								<FaTwitter className='text-2xl hover:text-blue-400' />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
