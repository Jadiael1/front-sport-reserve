import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IApiFieldResponse } from '../../interfaces/IApiFieldResponse';
import { IField } from '../../interfaces/IField';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/common/Modal';
import Carousel from '../../components/common/Carousel';
import Navbar from '../../components/common/NavBar/NavBar';
import { FaFutbol, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import FieldDetails from '../FieldDetails';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

const HomePage = () => {
	const { user } = useAuth();
	const [responseFields, setResponseFields] = useState<IApiFieldResponse | null>(null);
	const [selectedField, setSelectedField] = useState<IField | null>(null);
	const [isFieldDetailsModalVisible, setIsFieldDetailsModalVisible] = useState<boolean>(false);
	const [intrinsicSize, setIntrinsicSize] = useState<{ [key: string]: { width: number; height: number } }>({});
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();
	const galleryID = 'my-gallery';

	// const arrowSVGString = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 100 125" width="100" height="125"><path d="M5,50L50,5l3,3L11,50l42,42l-3,3L5,50z M92,95l3-3L53,50L95,8l-3-3L47,50L92,95z"/></svg>';
	const photoswipeOptions = {
		// arrowPrevSVG: arrowSVGString,
		// arrowNextSVG: arrowSVGString,
		closeTitle: 'Fechar a caixa de diálogo',
		zoomTitle: 'Amplie a foto',
		arrowPrevTitle: 'Ir para a foto anterior',
		arrowNextTitle: 'Vá para a próxima foto',
		errorMsg: 'A foto não pode ser carregada',
		indexIndicatorSep: ' de ',
	};
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
	}, [baseURL]);

	const handleRentClick = (field: IField) => {
		if (!user) {
			navigate(`/signin`);
			return;
		}
		setSelectedField(field);
		setIsFieldDetailsModalVisible(true);
	};

	const handleEditClick = (field: IField) => {
		navigate(`/fields/edit/${field.id}`, { state: { field } });
	};

	return (
		<>
			<Navbar />
			<section className='mx-auto p-2 sm:p-3 md:p-4 lg:p- w-full bg-background min-h-screen'>
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
										<div className='h-48 mb-5'>
											<Gallery
												withDownloadButton={false}
												withCaption={true}
												options={photoswipeOptions}
												id={galleryID}
											>
												<Carousel
													autoplay
													arrows={field.images.length > 1}
													className='h-full'
												>
													{field.images && field.images.length > 0 ?
														field.images.map(image => (
															<Item
																id={`pic-${image.id}`}
																key={image.id}
																original={`${baseURL}/${image.path}`.replace('/api/v1/', '')}
																width={intrinsicSize[image.path]?.width || 0}
																height={intrinsicSize[image.path]?.height || 0}
																caption={`${intrinsicSize[image.path]?.width || 0}x${intrinsicSize[image.path]?.height || 0}`}
															>
																{({ ref, open }) => (
																	<img
																		ref={ref}
																		onClick={open}
																		src={`${baseURL}/${image.path}`.replace('/api/v1/', '')}
																		alt={field.name}
																		data-pswp-width={intrinsicSize[image.path]?.width || 0}
																		data-pswp-height={intrinsicSize[image.path]?.height || 0}
																		onLoad={e => handleImageLoad(e, image.path)}
																		className='h-full w-full object-cover rounded-lg max-h-48 cursor-pointer'
																	/>
																)}
															</Item>
														))
													:	[
															<div
																className='h-full flex items-center justify-center'
																key='no-images'
															>
																<h3>Sem imagens</h3>
															</div>,
														]
													}
												</Carousel>
											</Gallery>
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
					height={576}
				>
					{selectedField && <FieldDetails field={selectedField} />}
				</Modal>
			</section>
		</>
	);
};

export default HomePage;