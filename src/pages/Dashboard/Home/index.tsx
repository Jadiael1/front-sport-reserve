import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/common/Sidebar';
import { AiOutlineFieldTime, AiOutlineUser } from 'react-icons/ai';

const Home = () => {
	const navigate = useNavigate();
	return (
		<Sidebar>
			<div className='flex flex-wrap justify-center gap-6 p-4'>
				{[
					{
						title: 'Configurar Disponibilidade dos Campos',
						description: 'Configure uma variedade de faixas de horário para um campo, para cada dia da semana.',
						buttonText: 'Ir',
						icon: <AiOutlineFieldTime className='text-4xl text-blue-500 mb-2' />,
						onClick: () => navigate('/dashboard/field-availabilities'),
					},
					{
						title: 'Configurar Usuários',
						description: 'Configure dados de usuários.',
						buttonText: 'Ir',
						icon: <AiOutlineUser className='text-4xl text-blue-500 mb-2' />,
						onClick: () => navigate('/dashboard/users'),
					},
				].map((card, index) => (
					<div
						key={index}
						className='bg-white shadow-lg rounded-lg p-6 w-full sm:w-1/2 lg:w-1/3 flex flex-col justify-between transition-transform transform hover:scale-105'
					>
						<div className='flex flex-col items-center'>
							{card.icon}
							<h5 className='text-xl font-bold text-gray-900 mb-2 text-center'>{card.title}</h5>
							<p className='text-gray-700 mb-4 text-center'>{card.description}</p>
						</div>
						<button
							onClick={card.onClick}
							className='bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
						>
							{card.buttonText}
						</button>
					</div>
				))}
			</div>
		</Sidebar>
	);
};

export default Home;
