import { ElementType } from 'react';
import { FaEdit } from 'react-icons/fa';

const InfoItem = ({
	icon,
	label,
	value = 'Not Provided',
	onEdit,
}: {
	icon: ElementType;
	label: string;
	value: string | number | undefined;
	onEdit?: () => void;
}) => {
	const IconComponent = icon;
	return (
		<div className='flex items-center mb-4'>
			<IconComponent className='text-gray-500 mr-2' />
			<div className='w-full'>
				<span className='font-medium text-gray-700'>{label}</span>
				<div className='flex items-center'>
					<div className='text-gray-900'>{value}</div>

					{onEdit && (
						<button
							onClick={onEdit}
							className='ml-2 text-blue-500 hover:text-blue-700 focus:outline-none'
						>
							<FaEdit />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default InfoItem;
