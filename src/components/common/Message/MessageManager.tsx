import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Message from './';

export interface MessageOptions {
	message: string;
	duration?: number;
	type?: 'success' | 'error' | 'warning' | 'info';
	id?: string;
}

const MessageManager = forwardRef((_, ref) => {
	const [messages, setMessages] = useState<MessageOptions[]>([]);

	const notify = useCallback(({ message, duration, type }: MessageOptions) => {
		const id = Math.random().toString(36).substring(2, 9);
		const newMessage = { message, duration, type, id };
		setMessages(prevMessages => [...prevMessages, newMessage]);
		setTimeout(() => {
			setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
		}, duration || 3000);
	}, []);

	useImperativeHandle(ref, () => ({
		notify,
	}));

	return (
		<div>
			{messages.map(msg => (
				<Message
					key={msg.id}
					{...msg}
				/>
			))}
		</div>
	);
});

MessageManager.displayName = 'MessageManager';

export default MessageManager;
