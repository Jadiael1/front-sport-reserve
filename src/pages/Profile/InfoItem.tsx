const InfoItem = ({
	icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: string | number | undefined;
}) => {
	const IconComponent = icon;
	return (
		<div className='flex items-center text-gray-700'>
			<IconComponent className='text-xl mr-4' />
			<div>
				<h2 className='font-semibold'>{label}</h2>
				<p>{value || 'Not Provided'}</p>
			</div>
		</div>
	);
};

export default InfoItem;
