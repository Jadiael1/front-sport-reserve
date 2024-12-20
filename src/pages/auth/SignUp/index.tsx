import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { CiWarning } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';
import goBack from '../../../utils/goBack.js';
import { messageManager } from '../../../components/common/Message/messageInstance.js';
import translations from '../../../utils/translations.json';
import Alert from '../../../components/common/Alert/index.js';
import ReCAPTCHA from 'react-google-recaptcha';

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
	const [errors, setErrors] = useState<{
		message: string;
		errors?: string | { [key: string]: string[] } | null;
	} | null>(null);
	const { login, user, isLoading } = useAuth();
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const [loading, setLoading] = useState(false);
	const [isCPFValid, setIsCPFValid] = useState(false);
	const [isPhoneValid, setIsPhoneValid] = useState(false);
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

	useEffect(() => {
		if (user && !isLoading) {
			navigate('/');
		}
	}, [user, isLoading, navigate]);

	const handleRecaptchaChange = (token: string | null) => {
		setRecaptchaToken(token);
	};

	const validateCPF = (cpf: string) => {
		const numbers = cpf.replace(/\D/g, '');
		return numbers.length === 11;
	};

	const formatCPF = (value: string) => {
		const numbers = value.replace(/\D/g, '');
		const isValid = validateCPF(numbers);
		setIsCPFValid(isValid);

		return numbers.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2}).*/, (_, g1, g2, g3, g4) => {
			if (!g2) return g1;
			if (!g3) return `${g1}.${g2}`;
			if (!g4) return `${g1}.${g2}.${g3}`;
			return `${g1}.${g2}.${g3}-${g4}`;
		});
	};

	const validatePhone = (phone: string) => {
		const numbers = phone.replace(/\D/g, '');
		return numbers.length >= 10 && numbers.length <= 11;
	};

	const formatPhone = (value: string) => {
		const numbers = value.replace(/\D/g, '');
		const isValid = validatePhone(numbers);
		setIsPhoneValid(isValid);

		return numbers.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (_, g1, g2, g3) => {
			if (!g2) return g1;
			if (!g3) return `(${g1}) ${g2}`;
			return `(${g1}) ${g2}-${g3}`;
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'cpf') {
			setFormData({
				...formData,
				[name]: formatCPF(value),
			});
		} else if (name === 'phone') {
			setFormData({
				...formData,
				[name]: formatPhone(value),
			});
		} else {
			setFormData({ ...formData, [name]: value });
		}
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

		if (!recaptchaToken) {
			setError('Por favor, complete o reCAPTCHA');
			setLoading(false);
			return;
		}

		const formDataToSend = {
			...formData,
			cpf: formData.cpf.replace(/\D/g, ''),
			phone: formData.phone.replace(/\D/g, ''),
			recaptcha_token: recaptchaToken,
		};

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
				body: JSON.stringify(formDataToSend),
			});
			const data = await response.json();
			setLoading(false);
			if (response.status === 201 && data.status === 'success') {
				await login(formData.email, formData.password);
				messageManager.notify({ message: 'Registro realizado com sucesso!', type: 'success', duration: 3000 });
				navigate('/');
			} else {
				setError(data.message || 'Falha ao registrar');
				setErrors({ message: data.message, errors: data.errors || data.message });
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
					onClick={() => goBack(navigate)}
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
							id='name'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.name}
							onChange={handleChange}
						/>
						<label
							htmlFor='name'
							className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'
						>
							Nome
						</label>
					</div>
					<div className='relative mb-6'>
						<input
							type='email'
							name='email'
							id='email'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.email}
							onChange={handleChange}
							autoComplete='username'
						/>
						<label
							htmlFor='email'
							className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'
						>
							Email
						</label>
						{error && error.includes('e-mail') && (
							<div className='flex items-center text-red-500 text-sm mt-1'>
								<CiWarning className='mr-1' />{' '}
								<span className='ml-2'>{translations[error as keyof typeof translations] || error}</span>
							</div>
						)}
					</div>
					<div className='relative mb-6'>
						<input
							type='password'
							name='password'
							id='password'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.password}
							onChange={handleChange}
							autoComplete='new-password'
						/>
						<label
							htmlFor='password'
							className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[100] bg-white px-3 peer-focus:px-1 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'
						>
							Senha
						</label>
					</div>
					<div className='relative mb-6'>
						<input
							type='password'
							name='password_confirmation'
							id='password_confirmation'
							placeholder=' '
							className='block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							required
							value={formData.password_confirmation}
							onChange={handleChange}
							autoComplete='new-password'
						/>
						<label
							htmlFor='password_confirmation'
							className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'
						>
							Confirme a Senha
						</label>
						{error && error.includes('senhas') && (
							<div className='flex items-center text-red-500 text-sm mt-1'>
								<CiWarning className='mr-1' />{' '}
								<span className='ml-2'>{translations[error as keyof typeof translations] || error}</span>
							</div>
						)}
					</div>
					<div className='relative mb-6'>
						<input
							type='text'
							name='cpf'
							id='cpf'
							placeholder=' '
							maxLength={14}
							className={`block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${formData.cpf && (isCPFValid ? '' : 'border-red-300')} appearance-none focus:outline-none focus:ring-0 ${isCPFValid ? 'focus:border-blue-600' : 'focus:border-blue-600'} peer`}
							required
							value={formData.cpf}
							onChange={handleChange}
						/>
						<label
							htmlFor='cpf'
							className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'
						>
							CPF
						</label>
						{/* {formData.cpf && !isCPFValid && <span className='text-xs text-red-500 mt-1'>Digite um CPF válido</span>} */}
					</div>
					<div className='relative mb-6'>
						<input
							type='text'
							name='phone'
							id='phone'
							placeholder=' '
							maxLength={15}
							className={`block px-2.5 pb-2.5 pt-3.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border  ${formData.phone && (isPhoneValid ? '' : 'border-red-300')} appearance-none focus:outline-none focus:ring-0 ${isPhoneValid ? 'focus:border-blue-600' : 'focus:border-blue-600'} peer`}
							required
							value={formData.phone}
							onChange={handleChange}
						/>
						<label
							htmlFor='phone'
							className='absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:bg-white peer-placeholder-shown:bg-transparent'
						>
							Telefone
						</label>
						{/* {formData.phone && !isPhoneValid && (<span className='text-xs text-red-500 mt-1'>Digite um telefone válido</span>)} */}
					</div>
					{error && !error.includes('e-mail') && !error.includes('senhas') && (
						<>
							{/* <div className='flex items-center text-red-500 text-sm mt-1'>
								<CiWarning className='mr-1' />{' '}
								<span className='ml-2'>{translations[error as keyof typeof translations] || error}</span>
							</div> */}
							<div className='mt-2 mb-2'>
								{errors && (
									<Alert
										message={errors.message}
										errors={errors.errors}
										onClose={() => setErrors(null)}
										type='error'
									/>
								)}
							</div>
						</>
					)}
					<div className='flex justify-center mb-4'>
						<ReCAPTCHA
							sitekey='6LfUYqEqAAAAACVb_XxpWC8M8F-AmnYLrOlA2CYg'
							onChange={handleRecaptchaChange}
						/>
					</div>
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
