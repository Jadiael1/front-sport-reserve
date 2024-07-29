import { IDaysOfTheWeek } from '../interfaces/IDaysOfTheWeek';

const translateDaysOfTheWeek = (day: keyof IDaysOfTheWeek | string) => {
	const translatedDaysOfTheWeek: IDaysOfTheWeek = {
		Monday: 'Segunda',
		Tuesday: 'Terça',
		Wednesday: 'Quarta',
		Thursday: 'Quinta',
		Friday: 'Sexta',
		Saturday: 'Sábado',
		Sunday: 'Domingo',
	};
	if (day in translatedDaysOfTheWeek) {
		return translatedDaysOfTheWeek[day as keyof IDaysOfTheWeek];
	} else {
		const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
		if (normalizedDay in translatedDaysOfTheWeek) {
			return translatedDaysOfTheWeek[normalizedDay as keyof IDaysOfTheWeek];
		} else {
			return 'Dia inválido';
		}
	}
};

export default translateDaysOfTheWeek;
