import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CiWarning } from 'react-icons/ci';

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

	// erros
	const [errors, setErrors] = useState({
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
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Validações
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

		// Validar o email e senha
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
		// 	----

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
			<div className='container mx-auto p-6 max-w-lg'>
				<h1 className='text-3xl font-bold mb-6 text-center'>SportReserve</h1>
				<p className='text-lg text-gray-700 mb-8 text-center'>Crie sua conta para começar a reservar!</p>
				<form
					onSubmit={handleRegister}
					className='bg-white p-8 rounded-lg shadow-lg'
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
						{errors.name && <div className='text-red-500 text-sm mt-1'>{errors.name}</div>}
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
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Email
						</label>
						{errors.email && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {errors.email}
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
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[100] bg-white px-3 peer-focus:px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Senha
						</label>
						{errors.password && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {errors.password}
							</div>
						)}
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
						/>
						<label className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'>
							Confirme a Senha
						</label>
						{errors.password_confirmation && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {errors.password_confirmation}
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
						{errors.cpf && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {errors.cpf}
							</div>
						)}
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
						{errors.phone && (
							<div className='text-red-500 text-sm mt-1'>
								<CiWarning /> {errors.phone}
							</div>
						)}
					</div>
					{error && <p className='text-red-500 text-sm mt-2 text-center mb-3'>{error}</p>}
					<button
						type='submit'
						disabled={loading}
						className='w-full px-3 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700'
					>
						{loading ? 'Registrando...' : 'Registrar'}
					</button>
					<button
						type='button'
						className='w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 mt-4 font-semibold'
						onClick={() => navigate('/signin')}
					>
						Voltar
					</button>
				</form>
			</div>
		</section>
	);
};

export default RegisterPage;
