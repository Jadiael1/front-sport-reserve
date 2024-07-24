import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';

interface MessageProps {
	message: string;
	duration?: number;
	type?: 'success' | 'error' | 'warning' | 'info';
}

const Message: React.FC<MessageProps> = ({ message, duration = 3000, type = 'success' }) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration]);

	if (!visible) return null;

	const typeStyles = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		warning: 'bg-yellow-500',
		info: 'bg-blue-500',
	};

	return ReactDOM.createPortal(
		<div
			className={`fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2 z-50 ${typeStyles[type]}`}
		>
			<AiOutlineCheckCircle size={24} />
			<span>{message}</span>
		</div>,
		document.body,
	);
};

export default Message;
