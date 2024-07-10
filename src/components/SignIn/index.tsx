import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignInPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { login, user, isLoading } = useAuth();

	useEffect(() => {
		if (user && !isLoading) {
			navigate('/');
		}
	}, []);

	const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		try {
			await login(email, password);
			navigate('/');
		} catch (error) {
			setError('Credenciais inválidas. Por favor, tente novamente.');
		}
	};

	return (
		<div className='container mx-auto p-4 bg-background w-full'>
			<h1 className='text-3xl font-bold mb-4'>Login</h1>
			<form onSubmit={handleSignIn}>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Email:</label>
					<input
						type='email'
						name='email'
						className='w-full p-2 border rounded'
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div className='mb-4'>
					<label className='block text-gray-700 mb-2'>Senha:</label>
					<input
						type='password'
						name='password'
						className='w-full p-2 border rounded'
						required
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				{error && <div className='text-red-500 mb-4'>{error}</div>}
				<button
					type='submit'
					className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
				>
					Entrar
				</button>
				<div className='flex justify-between mt-4'>
					<button
						type='button'
						className='text-blue-500 hover:underline'
						onClick={() => navigate('/forgot-password')}
					>
						Esqueceu a senha?
					</button>
					<button
						type='button'
						className='text-blue-500 hover:underline'
						onClick={() => navigate('/signup')}
					>
						Não tem uma conta? Registre-se
					</button>
				</div>
				<button
					type='button'
					className='w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300 mt-4'
					onClick={() => navigate('/')}
				>
					Voltar
				</button>
			</form>
		</div>
	);
};

export default SignInPage;
