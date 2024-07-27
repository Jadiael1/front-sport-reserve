import { NavigateFunction } from 'react-router-dom';

const goBack = (navigate: NavigateFunction, defaultPath: string = '/') => {
	if (window.history.length > 1) {
		navigate(-1);
	} else {
		navigate(defaultPath);
	}
};

export default goBack;
