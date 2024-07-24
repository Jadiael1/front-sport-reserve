const formatDate = (date: Date, format: string | null = null): string => {
	format = format || 'dd/mm/yyyy hh:mm';

	const dateFormated = date
		.toLocaleString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'America/Recife',
		})
		.replace(',', '');

	if (format === 'dd/mm/yyyy hh:mm') {
		return dateFormated;
	}

	return dateFormated;
};

export default formatDate;
