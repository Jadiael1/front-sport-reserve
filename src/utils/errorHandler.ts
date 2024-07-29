import { messageManager } from '../components/common/Message/messageInstance';
import { translate } from './translate';

interface ErrorResponse {
	status: string;
	message: string;
	data: null;
	errors: Record<string, string[]>;
}

export const handleValidationError = (error: ErrorResponse) => {
	if (error.status === 'error' && error.errors) {
		Object.keys(error.errors).forEach(key => {
			error.errors[key].forEach(errorMessage => {
				messageManager.notify({
					message: translate(errorMessage),
					type: 'error',
					duration: 5000,
				});
			});
		});
	} else {
		messageManager.notify({
			message: error.message,
			type: 'error',
			duration: 5000,
		});
	}
};
