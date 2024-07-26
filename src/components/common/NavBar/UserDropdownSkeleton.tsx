const UserDropdownSkeleton = () => {
	return (
		<div className='hidden md:flex relative animate-pulse'>
			<div className='flex items-center'>
				<div className='h-8 w-8 bg-gray-300 rounded-full'></div>
				<div className='ml-2 w-24 bg-gray-300 h-4 rounded'></div>
				<div className='ml-1 h-4 w-4 bg-gray-300 rounded'></div>
			</div>
		</div>
	);
};

export default UserDropdownSkeleton;
