import React from 'react';
import { createRoot } from 'react-dom/client';
import Message from './';

interface MessageOptions {
	message: string;
	duration?: number;
	type?: 'success' | 'error' | 'warning' | 'info';
}

class MessageManager {
	private container: HTMLDivElement;

	constructor() {
		this.container = document.createElement('div');
		document.body.appendChild(this.container);
	}

	notify({ message, duration, type }: MessageOptions) {
		const notificationRoot = createRoot(this.container);
		const element = React.createElement(Message, { message, duration, type });
		notificationRoot.render(element);
		setTimeout(() => {
			notificationRoot.unmount();
		}, duration || 3000);
	}
}

export const messageManager = new MessageManager();
