import React, { useState } from 'react';

interface DateTimePickerProps {
	dateLabel: string;
	timeLabel: string;
	value: string;
	onChange: (value: string) => void;
}

const DatePicker: React.FC<DateTimePickerProps> = ({ dateLabel, timeLabel, onChange }) => {
	const [date, setDate] = useState<string>('');
	const [time, setTime] = useState<string>('');

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setDate(newDate);
		if (newDate && time) {
			onChange(`${newDate}T${time}`);
		}
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);
		if (date && newTime) {
			onChange(`${date}T${newTime}`);
		}
	};

	return (
		<div className='flex space-x-4'>
			<div className='relative w-full max-w-xs'>
				<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
					{dateLabel}
				</label>
				<input
					type='date'
					value={date}
					onChange={handleDateChange}
					className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
				/>
			</div>
			<div className='relative w-full max-w-xs'>
				<label className='absolute text-sm text-dark-500 bg-white dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1'>
					{timeLabel}
				</label>
				<input
					type='time'
					value={time}
					onChange={handleTimeChange}
					className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none dark:text-dark dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
				/>
			</div>
		</div>
	);
};

export default DatePicker;
