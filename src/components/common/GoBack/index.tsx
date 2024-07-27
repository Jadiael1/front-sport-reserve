import React from 'react';
import { useNavigate, matchPath } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { FaArrowLeft } from 'react-icons/fa';
import routes from '../../../routes/routes';

interface GoBackButtonProps {
	defaultPath?: string;
	className?: string;
	merge?: boolean;
	defaultClassName?: boolean;
}

const GoBackButton: React.FC<GoBackButtonProps> = ({
	defaultPath = '/',
	merge = false,
	className = '',
	defaultClassName = false,
	...props
}) => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		const currentUrl = window.location.href;
		const referrerUrl = document.referrer;
		const baseUrl = window.location.origin;
		const relativeReferrerUrl = referrerUrl.replace(baseUrl, '');
		const isProtectedReferrer = routes
			.filter(route => route.protected)
			.some(route => matchPath(route.path, relativeReferrerUrl));

		if (
			window.history.length > 1 &&
			referrerUrl &&
			referrerUrl !== currentUrl &&
			referrerUrl.startsWith(baseUrl) &&
			!isProtectedReferrer
		) {
			navigate(-1);
		} else {
			navigate(defaultPath);
		}
	};

	const classNameDefault =
		defaultClassName ?
			'flex items-center px-4 py-2 bg-transparent text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105'
		:	'';

	return (
		<button
			onClick={handleGoBack}
			className={merge ? twMerge(classNameDefault, className) : `${classNameDefault} ${className}`}
			{...props}
		>
			<FaArrowLeft className='mr-2' />
			Voltar
		</button>
	);
};

export default GoBackButton;
