import { NavigateFunction } from 'react-router-dom';

const goBack = (navigate: NavigateFunction, defaultPath: string = '/') => {
	const currentUrl = window.location.href;
	const referrerUrl = document.referrer;
	const baseUrl = window.location.origin;
	if (window.history.length > 1 && referrerUrl && referrerUrl !== currentUrl && referrerUrl.startsWith(baseUrl)) {
		navigate(-1);
	} else {
		navigate(defaultPath);
	}
};

export default goBack;
