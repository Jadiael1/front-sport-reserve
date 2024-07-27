import React, { FC } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
	title: string;
	open: boolean;
	onCancel: () => void;
	children: React.ReactNode;
	footer?: React.ReactNode;
	width?: number;
	height?: number;
}

const Modal: FC<ModalProps> = ({ title, open, onCancel, children, footer }) => {
	if (!open) return null;

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50'>
			<div
				className='bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl'
				style={{ maxHeight: '90vh' }}
			>
				<div className='flex justify-between items-center p-4 border-b'>
					<h2 className='text-xl font-semibold'>{title}</h2>
					<button onClick={onCancel}>
						<IoClose size={24} />
					</button>
				</div>
				<div
					className='p-4 overflow-auto'
					style={{ maxHeight: 'calc(90vh - 96px)' }}
				>
					{children}
				</div>
				{footer && <div className='p-4 border-t'>{footer}</div>}
			</div>
		</div>
	);
};

export default Modal;
