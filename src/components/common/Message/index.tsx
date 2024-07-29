import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai';

interface MessageProps {
	message: string;
	duration?: number;
	type?: 'success' | 'error' | 'warning' | 'info';
	index: number;
}

const Message: React.FC<MessageProps> = ({ message, duration = 3000, type = 'success', index }) => {
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

	const typeIcons = {
		success: <AiOutlineCheckCircle size={24} />,
		error: <AiOutlineCloseCircle size={24} />,
		warning: <AiOutlineWarning size={24} />,
		info: <AiOutlineInfoCircle size={24} />,
	};

	return ReactDOM.createPortal(
		<div
			className={`fixed left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2 z-50 ${typeStyles[type]}`}
			style={{ top: `${4 + index * 60}px` }}
		>
			{typeIcons[type]}
			<span>{message}</span>
		</div>,
		document.body,
	);
};

export default Message;
