import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import backgroundImage from '../../assets/img/campo.jpg';

const SignInPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { login, user, isLoading } = useAuth();

	useEffect(() => {
		if (user && !isLoading) {
			navigate('/');
		}
	}, [user, isLoading, navigate]);

	const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(email, password);
			navigate('/');
		} catch (error) {
			setError('Credenciais inválidas. Por favor, tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section
			className='min-h-screen flex items-center justify-center'
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md md:max-w-xl'>
				<h1 className='text-4xl font-bold my-3 text-center text-blue-700'>SportReserve</h1>
				<p className='text-sm mb-6 text-center'>Aluguel fácil, jogo garantido</p>

				<form
					onSubmit={handleSignIn}
					className='mx-4 md:mx-auto '
				>
					<div className='relative mb-6'>
						<input
							type='email'
							name='email'
							placeholder=' '
							className='peer block w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 placeholder-transparent'
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<label
							className={`absolute left-2 top-2 text-gray-500 transition-all duration-300 transform 
                                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 
                                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-gray-500
                                ${email ? '-top-4 text-sm' : ''}`}
						>
							E-mail
						</label>
					</div>
					<div className='relative mb-6'>
						<input
							type='password'
							name='password'
							placeholder=' '
							className='peer block w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 placeholder-transparent'
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<label
							className={`absolute left-2 top-2 text-gray-500 transition-all duration-300 transform 
                                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 
                                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-gray-500
                                ${password ? '-top-4 text-sm' : ''}`}
						>
							Senha
						</label>
					</div>
					{error && <div className='text-red-500 mb-4'>{error}</div>}
					<div className='flex items-center justify-center'>
						<button
							type='submit'
							className='w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 relative'
							disabled={loading}
						>
							{loading ?
								<svg
									className='animate-spin h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									/>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zm2-11.732a7.965 7.965 0 014 1.733L9 7.98A5.963 5.963 0 006 12H2c0-2.056.835-3.921 2.196-5.291z'
									/>
								</svg>
							:	'Entrar'}
						</button>
					</div>
					<div className='flex justify-end mt-3 '>
						<button
							type='button'
							className='hover:underline text-sm'
							onClick={() => navigate('/forgot-password')}
						>
							Esqueceu a senha?
						</button>
					</div>
					<div className='flex items-center justify-center'>
						<button
							type='button'
							className='w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition duration-300 mt-4'
							onClick={() => navigate('/')}
						>
							Voltar
						</button>
					</div>

					<div className='flex justify-center mt-4'>
						<button
							type='button'
							className='text-blue-500 hover:underline'
							onClick={() => navigate('/signup')}
						>
							<p className='text-gray-500'>
								Não tem uma conta? <span className='text-red-500 font-bold'>Registre-se</span>
							</p>
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default SignInPage;
