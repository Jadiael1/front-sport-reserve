const EditInputField = ({
	label,
	name,
	value,
	placeholder,
	icon,
	type = 'text',
	autocomplete = undefined,
	handleInputChange,
}: {
	label: string;
	name: string;
	value: string | number | undefined;
	placeholder: string;
	icon: React.ElementType;
	type?: string;
	autocomplete?: string;
	handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const IconComponent = icon;
	return (
		<div className='mb-4'>
			<label
				htmlFor={name}
				className='block pl-10 text-gray-700 text-sm font-bold mb-2'
			>
				{label}
			</label>
			<div className='flex items-center'>
				<IconComponent className='text-xl mr-4' />
				<input
					type={type}
					name={name}
					value={value || ''}
					id={name}
					onChange={handleInputChange}
					placeholder={placeholder}
					autoComplete={autocomplete}
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
				/>
			</div>
		</div>
	);
};

export default EditInputField;
