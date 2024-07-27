import React, { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';

interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	icon?: ReactNode;
	className?: string;
	defaultClassName: boolean;
	merge?: boolean;
}

const ConfirmationModal = ({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
	icon,
	className = '',
	defaultClassName = false,
	merge = false,
	...props
}: ConfirmationModalProps) => {
	if (!isOpen) return null;
	const classNameDefault =
		defaultClassName ? 'fixed inset-0 flex items-center justify-center bg-background bg-opacity-50 z-50' : '';
	return (
		<div
			className={merge ? twMerge(classNameDefault, className) : `${classNameDefault} ${className}`}
			{...props}
		>
			<div className='bg-white rounded-lg shadow-lg w-96 p-6 relative'>
				<button
					onClick={onCancel}
					className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
				>
					<AiOutlineClose size={24} />
				</button>
				<div className='flex items-center justify-center mb-4'>{icon}</div>
				<h2 className='text-xl font-semibold text-center mb-2'>{title}</h2>
				<p className='text-gray-700 text-center mb-6'>{message}</p>
				<div className='flex justify-center space-x-4'>
					<button
						onClick={onCancel}
						className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200'
					>
						Cancelar
					</button>
					<button
						onClick={onConfirm}
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200'
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
