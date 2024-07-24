import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { CiWarning } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';

const RegisterPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		cpf: '',
		phone: '',
	});
	const [error, setError] = useState<string | null>(null);
	const { login, user, isLoading } = useAuth();
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user && !isLoading) {
			navigate('/');
		}
	}, [user, isLoading, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const isValidEmail = (email: string) => {
		return /\S+@\S+\.\S+/.test(email);
	};

	const passwordsMatch = (password: string, confirmPassword: string) => {
		return password === confirmPassword;
	};

	const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setLoading(true);

		// Validate email and password
		if (!isValidEmail(formData.email)) {
			setError('Por favor, insira um e-mail válido');
			setLoading(false);
			return;
		}

		if (!passwordsMatch(formData.password, formData.password_confirmation)) {
			setError('As senhas não conferem');
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`${baseURL}/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			setLoading(false);
			if (response.status === 201 && data.status === 'success') {
				await login(formData.email, formData.password);
				alert('Registro realizado com sucesso!');
				navigate('/');
			} else {
				setError(data.message || 'Falha ao registrar');
			}
		} catch (error) {
			setError('Falha ao registrar');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className='flex items-center justify-center min-h-screen bg-slate-200'>
			<div className='container mx-auto p-6 max-w-lg border border-gray-200 bg-white rounded-lg'>
				<button
					className='flex items-center px-4 py-2 bg-transparent text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105'
					onClick={() => navigate(-1)}
				>
					<FaArrowLeft className='mr-2' />
					Voltar
				</button>
				<h1 className='text-3xl text-blue-700 font-bold mb-6 text-center'>SportReserve</h1>

				<p className='text-lg text-gray-700 mb-8 text-center'>Crie sua conta para começar a reservar!</p>
				<form
					onSubmit={handleRegister}
					className='p-8 rounded-lg'
				>
					<div className='relative mb-6'>
						<input
							type='text'
							name='name'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.name}
							onChange={handleChange}
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Nome
						</label>
					</div>
					<div className='relative mb-6'>
						<input
							type='email'
							name='email'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.email}
							onChange={handleChange}
							autoComplete='username'
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Email
						</label>
						{error && error.includes('e-mail') && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {error}
							</div>
						)}
					</div>
					<div className='relative mb-6'>
						<input
							type='password'
							name='password'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.password}
							onChange={handleChange}
							autoComplete='new-password'
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[100] bg-white px-3 peer-focus:px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Senha
						</label>
					</div>
					<div className='relative mb-6'>
						<input
							type='password'
							name='password_confirmation'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.password_confirmation}
							onChange={handleChange}
							autoComplete='new-password'
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Confirme a Senha
						</label>
						{error && error.includes('senhas') && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {error}
							</div>
						)}
					</div>
					<div className='relative mb-6'>
						<input
							type='text'
							name='cpf'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.cpf}
							onChange={handleChange}
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							CPF
						</label>
					</div>
					<div className='relative mb-6'>
						<input
							type='text'
							name='phone'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.phone}
							onChange={handleChange}
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Telefone
						</label>
					</div>
					{error && !error.includes('e-mail') && !error.includes('senhas') && (
						<div className='text-red-500 text-sm mt-1'>
							<CiWarning /> {error}
						</div>
					)}
					<button
						type='submit'
						className='w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'
						disabled={loading}
					>
						{loading ? 'Carregando...' : 'Registrar'}
					</button>
				</form>
			</div>
		</section>
	);
};

export default RegisterPage;
