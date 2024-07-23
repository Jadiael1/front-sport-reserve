import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IApiResponse, IField } from './interfaces/IFields';
import { useAuth } from '../../contexts/AuthContext';
import { Carousel, Modal } from 'antd';
import { Navbar } from '../NavBar/NavBar';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { CiLogin } from 'react-icons/ci';
import { IoMdFootball } from 'react-icons/io';
import { FaFutbol, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import FieldDetails from '../FieldDetails/index';

const HomePage = () => {
	const { user, isLoading } = useAuth();
	const [responseFields, setResponseFields] = useState<IApiResponse | null>(null);
	const [selectedField, setSelectedField] = useState<IField | null>(null);
	const [isFieldDetailsModalVisible, setIsFieldDetailsModalVisible] = useState<boolean>(false);
	const [intrinsicSize, setIntrinsicSize] = useState<{ [key: string]: { width: number; height: number } }>({});
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();
	const galleryID = 'my-gallery';
	const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>, imagePath: string) => {
		const { naturalWidth, naturalHeight } = event.currentTarget;
		setIntrinsicSize(prevSizes => ({
			...prevSizes,
			[imagePath]: { width: naturalWidth, height: naturalHeight },
		}));
	};

	useEffect(() => {
		fetch(`${baseURL}/fields`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		})
			.then(resp => resp.json())
			.then(resp => setResponseFields(resp))
			.catch(err => console.error(err));

		// PhotoSwipeLightbox
		const lightbox = new PhotoSwipeLightbox({
			gallery: `#${galleryID}`,
			children: 'a',
			pswpModule: () => import('photoswipe'),
			zoom: true,
			spacing: 0.1,
			bgOpacity: 0.8,
			allowPanToNext: false,
			loop: false,
			wheelToZoom: true,
			padding: { top: 20, bottom: 40, left: 100, right: 100 },
			indexIndicatorSep: ' / ',
			closeTitle: 'Fechar a caixa de diálogo',
			zoomTitle: 'Amplie a foto',
			arrowPrevTitle: 'Ir para a foto anterior',
			arrowNextTitle: 'Vá para a próxima foto',
			errorMsg: 'A foto não pode ser carregada',
			initialZoomLevel: 'fill',
			secondaryZoomLevel: 1,
			showHideAnimationType: 'zoom',
			showAnimationDuration: 2,
			counter: true,
		});

		lightbox.init();

		return () => {
			lightbox.destroy();
		};
	}, [baseURL, galleryID]);

	const handleRentClick = (field: IField) => {
		if (!user) {
			navigate(`/field/${field.id}`, { state: { field } });
		}
		setSelectedField(field);
		setIsFieldDetailsModalVisible(true);
	};

	const handleEditClick = (field: IField) => {
		navigate(`/fields/edit/${field.id}`, { state: { field } });
	};

	const handleGoSignIn = () => {
		navigate(`/signin`);
	};

	return (
		<section className='mx-auto p-2 sm:p-3 md:p-4 lg:p- w-full bg-background min-h-screen'>
			{!isLoading && user ?
				<div className='flex items-center justify-evenly my-2 md:mx-3 border-b-2 pb-3'>
					<div className='flex items-center justify-center gap-5 w-full sm:w-3/4 md:w-1/2 lg:w-1/3'>
						<h1 className='text-blue-700 text-3xl sm:text-4xl md:text-5xl font-bold'>SportReserve</h1>
						<span className='text-4xl sm:text-5xl md:text-6xl animate-spin-slow'>
							<IoMdFootball />
						</span>
					</div>
					<Navbar />
				</div>
			:	<div className='flex justify-end mb-4 mt-5 md:mt-5 '>
					<div className='flex items-center justify-evenly w-full border-b pb-3'>
						<div className='flex items-center justify-center gap-5 w-full sm:w-3/4 md:w-1/2 lg:w-1/3'>
							<h1 className='text-blue-700 text-3xl sm:text-4xl md:text-5xl font-bold'>SportReserve</h1>
							<span className='text-4xl sm:text-5xl md:text-6xl animate-spin-slow'>
								<IoMdFootball />
							</span>
						</div>
						<div className=''>
							<button
								className='flex items-center justify-center gap-1 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300 md:mr-16 '
								onClick={handleGoSignIn}
							>
								<CiLogin className='text-2xl' />
								Entrar
							</button>
						</div>
					</div>
				</div>
			}

			<div className='text-center mb-8'>
				<h3 className='text-dark text-2xl sm:text-2xl md:text-3xl font-bold mt-5'>
					Alugue nossas quadras esportivas com facilidade.
				</h3>
				<p className='mt-5'>Escolha uma das nossas quadras </p>
			</div>

			{/* Conteúdo dos campos */}
			{responseFields ?
				<div className='flex items-center justify-evenly'>
					{responseFields.data.data.length ?
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6 w-3/4 mt-12'>
							{responseFields.data.data.map(field => (
								<div
									key={field.id}
									className='bg-white p-6 rounded-lg shadow-md max-w-xs md:max-w-md lg:max-w-lg'
								>
									<h3 className='text-xl font-semibold mb-2 text-center'>{field.name}</h3>

									<div className='text-gray-700 mb-2 flex items-center mt-3'>
										<div className='flex items-center gap-1'>
											<FaMapMarkerAlt className='mr-2 text-red-500' />
											<h3 className='font-bold'>Localização: </h3>
											<p>{field.location}</p>
										</div>
									</div>
									<div className='text-gray-700 mb-2 flex items-center'>
										<div className='flex items-center gap-1'>
											<FaFutbol className='mr-2' />
											<h3 className='font-bold'>Modalidade:</h3>
											<span>{field.type}</span>
										</div>
									</div>
									<div className='text-gray-700 mb-2 flex items-center'>
										<div className='flex items-center gap-1'>
											<FaDollarSign className='mr-2 text-green-400' />
											<h3 className='font-bold'>Valor da hora: </h3>
											<span>R$ {field.hourly_rate}</span>
										</div>
									</div>
									<div className='h-48'>
										<Carousel
											autoplay
											arrows={field.images.length > 1}
											className='pswp-gallery h-full'
											id={galleryID}
										>
											{field.images && field.images.length > 0 ?
												field.images.map((image, index) => (
													<a
														href={`${baseURL}/${image.path}`.replace('/api/v1/', '')}
														data-pswp-width={intrinsicSize[image.path]?.width || 0}
														data-pswp-height={intrinsicSize[image.path]?.height || 0}
														key={`${galleryID}-${index}`}
														target='_blank'
														rel='noreferrer'
													>
														<img
															src={`${baseURL}/${image.path}`.replace('/api/v1/', '')}
															alt={field.name}
															onLoad={e => handleImageLoad(e, image.path)}
														/>
													</a>
												))
											:	<div className='h-full flex items-center justify-center'>
													<h3>Sem imagens</h3>
												</div>
											}
										</Carousel>
									</div>

									<div className='flex items-center '>
										{user?.is_admin && (
											<button
												className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 mt-3 mr-3 w-full'
												onClick={() => handleEditClick(field)}
											>
												Editar
											</button>
										)}
										<button
											className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-3 w-full'
											onClick={() => handleRentClick(field)}
										>
											Alugar
										</button>
									</div>
								</div>
							))}
						</div>
					:	<div className='flex justify-center'>
							<h2>Nenhum arena disponível no momento.</h2>
						</div>
					}
				</div>
			:	<div className='flex justify-center items-center'>
					<h2>Carregando arenas...</h2>
				</div>
			}

			{/* Modal para reserva */}
			<Modal
				title='Reserve seu horário'
				open={isFieldDetailsModalVisible}
				onCancel={() => setIsFieldDetailsModalVisible(false)}
				footer={null}
				width={800}
				height={500}
			>
				{selectedField && <FieldDetails field={selectedField} />}
			</Modal>
		</section>
	);
};

export default HomePage;
