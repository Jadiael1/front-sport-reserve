const capitalize = (text: string) => {
	return text
		.split(' ')
		.map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
		.join(' ');
};

export default capitalize;
