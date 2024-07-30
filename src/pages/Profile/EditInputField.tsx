import React from 'react';
import { IconType } from 'react-icons';

interface EditInputFieldProps {
	icon: IconType;
	label: string;
	name: string;
	value: string | undefined;
	placeholder: string;
	autocomplete: string;
	handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditInputField: React.FC<EditInputFieldProps> = ({
	icon: Icon,
	label,
	name,
	value,
	placeholder,
	autocomplete,
	handleInputChange,
}) => (
	<div className='mb-4'>
		<label
			className='block text-gray-700 text-sm font-bold mb-2'
			htmlFor={name}
		>
			{label}
		</label>
		<div className='flex items-center border rounded py-2 px-3'>
			<Icon className='text-gray-500 mr-2' />
			<input
				type='text'
				name={name}
				id={name}
				value={value}
				onChange={handleInputChange}
				placeholder={placeholder}
				autoComplete={autocomplete}
				className='w-full border-none focus:outline-none focus:shadow-outline'
			/>
		</div>
	</div>
);

export default EditInputField;
