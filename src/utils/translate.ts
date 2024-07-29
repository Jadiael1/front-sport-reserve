import translations from './translations.json';

export const translate = (key: string): string => {
	return (translations as Record<string, string>)[key] || key;
};
