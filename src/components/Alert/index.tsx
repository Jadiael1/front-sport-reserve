import React from 'react';
import { useNavigate } from 'react-router-dom';

type AlertProps = {
	message: string;
	errors?: { [key: string]: string[] };
	onClose: () => void;
	type: 'success' | 'error';
	redirectTo?: string;
};

const Alert: React.FC<AlertProps> = ({ message, errors, onClose, type, redirectTo }) => {
	const navigate = useNavigate();

	const alertStyles =
		type === 'success' ?
			'bg-green-100 border border-green-400 text-green-700'
		:	'bg-red-100 border border-red-400 text-red-700';

	const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

	const handleRedirect = () => {
		if (redirectTo) {
			navigate(redirectTo);
		}
	};

	return (
		<div
			className={`${alertStyles} px-4 py-3 rounded relative`}
			role='alert'
		>
			<strong className='font-bold'>{type === 'success' ? 'Success: ' : 'Error: '}</strong>
			<span className='block sm:inline'>{message}</span>
			{redirectTo && (
				<span
					className='block sm:inline text-blue-500 cursor-pointer underline ml-2'
					onClick={handleRedirect}
				>
					Click here to proceed
				</span>
			)}
			{type === 'error' && errors && (
				<ul className='mt-2'>
					{Object.keys(errors).map(key => (
						<React.Fragment key={key}>
							{Array.isArray(errors[key]) ?
								errors[key].map((err, index) => (
									<li key={`${key}-${index}`}>
										{key}: {err}
									</li>
								))
							:	<li key={key}>
									{key}: {errors[key]}
								</li>
							}
						</React.Fragment>
					))}
				</ul>
			)}
			<span
				className='absolute top-0 bottom-0 right-0 px-4 py-3'
				onClick={onClose}
			>
				<svg
					className={`fill-current h-6 w-6 ${iconColor}`}
					role='button'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
				>
					<title>Close</title>
					<path d='M14.348 5.652a.5.5 0 010 .707L10.707 10l3.641 3.641a.5.5 0 11-.707.707L10 10.707l-3.641 3.641a.5.5 0 01-.707-.707L9.293 10 5.652 6.359a.5.5 0 11.707-.707L10 9.293l3.641-3.641a.5.5 0 01.707 0z' />
				</svg>
			</span>
		</div>
	);
};

export default Alert;
