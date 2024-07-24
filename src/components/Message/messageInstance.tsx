import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import MessageManager, { MessageOptions } from './MessageManager';

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);

const notifyFunctionRef = { current: null as null | ((options: MessageOptions) => void) };

const MessageWrapper: React.FC = () => {
	const managerRef = useRef<{ notify: (options: MessageOptions) => void }>(null);

	useEffect(() => {
		if (managerRef.current) {
			notifyFunctionRef.current = managerRef.current.notify;
		}
	}, []);

	return <MessageManager ref={managerRef} />;
};

root.render(<MessageWrapper />);

export const messageManager = {
	notify: (options: MessageOptions) => {
		if (notifyFunctionRef.current) {
			notifyFunctionRef.current(options);
		}
	},
};
