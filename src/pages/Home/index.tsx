import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IApiFieldResponse } from '../../interfaces/IApiFieldResponse';
import { IField } from '../../interfaces/IField';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/common/Modal';
import Carousel from '../../components/common/Carousel';
import Navbar from '../../components/common/NavBar/NavBar';
import { FaFutbol, FaMapMarkerAlt, FaDollarSign, FaShoppingCart, FaEdit, FaTrash } from 'react-icons/fa';
import FieldDetails from '../FieldDetails';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import ConfirmationModal from '../../components/common/ConfirmationModalProps';
import { messageManager } from '../../components/common/Message/messageInstance';

const HomePage = () => {
	const { user, token } = useAuth();
	const [responseFields, setResponseFields] = useState<IApiFieldResponse | null>(null);
	const [selectedField, setSelectedField] = useState<IField | null>(null);
	const [isFieldDetailsModalVisible, setIsFieldDetailsModalVisible] = useState<boolean>(false);
	const [intrinsicSize, setIntrinsicSize] = useState<{ [key: string]: { width: number; height: number } }>({});
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const [fieldToDelete, setFieldToDelete] = useState<IField | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const navigate = useNavigate();
	const galleryID = 'my-gallery';

	const photoswipeOptions = {
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
		const fetchFields = async () => {
			const headers: HeadersInit = {
				Accept: 'application/json',
			};
			if (user && user.is_admin) {
				headers['Authorization'] = `Bearer ${token}`;
			}
			try {
				const response = await fetch(`${baseURL}/fields?per_page=8&page=${currentPage}`, {
					method: 'GET',
					headers,
				});
				const respData = await response.json();
				setResponseFields(respData);
				setTotalPages(respData.data.last_page);
			} catch (err) {
				console.error('Erro ao buscar quadras:', err);
			}
		};
		fetchFields();
	}, [baseURL, token, user, currentPage]);

	const handleRentClick = (field: IField) => {
		if (!user) {
			navigate(`/auth/signin`);
			return;
		}
		setSelectedField(field);
		setIsFieldDetailsModalVisible(true);
	};

	const handleEditClick = (field: IField) => {
		navigate(`/fields/edit/${field.id}`, { state: { field } });
	};

	const handleDeleteClick = async (field: IField) => {
		setFieldToDelete(field);
		// open confirmation modal
		setConfirmationModal(true);
	};

	const confirmDeleteField = async () => {
		if (!fieldToDelete) return;
		try {
			const response = await fetch(`${baseURL}/fields/${fieldToDelete.id}`, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});
			const result = await response.json();
			if (result.status === 'success') {
				setResponseFields(prevFields => {
					if (!prevFields) return prevFields;
					return {
						...prevFields,
						data: {
							...prevFields.data,
							data: prevFields.data.data.filter(field => field.id !== fieldToDelete.id),
						},
					};
				});
				messageManager.notify({
					message: 'Quadra deletada com sucesso.',
					type: 'success',
					duration: 3000,
				});
			} else {
				messageManager.notify({
					message: 'Falha ao deletar a quadra.',
					type: 'error',
					duration: 3000,
				});
			}
		} catch (error) {
			console.error('Error deleting field:', error);
			messageManager.notify({
				message: 'Erro ao deletar a quadra.',
				type: 'error',
				duration: 3000,
			});
		} finally {
			setFieldToDelete(null);
			setConfirmationModal(false);
		}
	};

	return (
		<>
			<Navbar />
			<section className='mx-auto p-4 w-full bg-background min-h-screen'>
				<div className='text-center mb-8'>
					<h3 className='text-dark text-2xl md:text-3xl font-bold mt-5'>
						Alugue nossas quadras esportivas com facilidade.
					</h3>
					<p className='mt-2'>Escolha uma das nossas quadras</p>
				</div>

				{responseFields ?
					<div>
						{responseFields.data.data.length ?
							<>
								<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
									{responseFields.data.data.map(field => (
										<div
											key={field.id}
											className={`${field.status === 'inactive' ? 'opacity-50 bg-gray-200' : 'bg-white'} p-6 rounded-lg shadow-md w-full max-w-sm mx-auto`}
										>
											<h3 className='text-xl font-semibold mb-2 text-center'>{field.name}</h3>

											<div className='text-gray-700 mb-2 flex items-center'>
												<FaMapMarkerAlt className='mr-2 text-red-500' />
												<h3 className='font-bold mr-1'>Localização:</h3>
												<p>{field.location}</p>
											</div>
											<div className='text-gray-700 mb-2 flex items-center'>
												<FaFutbol className='mr-2' />
												<h3 className='font-bold mr-1'>Modalidade:</h3>
												<span>{field.type}</span>
											</div>
											<div className='text-gray-700 mb-2 flex items-center'>
												<FaDollarSign className='mr-2 text-green-400' />
												<h3 className='font-bold mr-1'>Valor da hora:</h3>
												<span>R$ {field.hourly_rate}</span>
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
																			className='h-full w-full object-cover rounded-lg cursor-pointer'
																		/>
																	)}
																</Item>
															))
														:	[
																<div
																	className='h-full flex items-center justify-center'
																	key='no-image'
																>
																	<h3>Sem imagens</h3>
																</div>,
															]
														}
													</Carousel>
												</Gallery>
											</div>

											<div className='flex flex-wrap justify-center gap-2'>
												{field.status === 'inactive' ?
													<p>Status: Inativo</p>
												:	<p>✓</p>}
												<button
													className={`${field.status === 'inactive' ? 'hidden' : ''} bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center w-full`}
													onClick={() => handleRentClick(field)}
												>
													<FaShoppingCart className='mr-2' />
													Alugar
												</button>
												{user?.is_admin && (
													<>
														<button
															className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center w-full'
															onClick={() => handleEditClick(field)}
														>
															<FaEdit className='mr-2' />
															Editar
														</button>
														<button
															className={`${field.status === 'inactive' ? 'hidden' : ''} bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center justify-center w-full`}
															onClick={() => handleDeleteClick(field)}
														>
															<FaTrash className='mr-2' />
															Deletar
														</button>
													</>
												)}
											</div>
										</div>
									))}
								</div>
								<div className='flex justify-center items-center mt-8 space-x-4'>
									<button
										onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
										disabled={currentPage === 1}
										className={`${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded`}
									>
										&laquo;
									</button>
									<span className='text-lg font-bold'>
										{currentPage} de {totalPages}
									</span>
									<button
										onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
										disabled={currentPage === totalPages}
										className={`${currentPage === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded`}
									>
										&raquo;
									</button>
								</div>
							</>
						:	<div className='flex justify-center w-full'>
								<h2>Nenhuma arena disponível no momento.</h2>
							</div>
						}
					</div>
				:	<div className='flex justify-center items-center w-full'>
						<h2>Carregando arenas...</h2>
					</div>
				}

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

				<ConfirmationModal
					isOpen={confirmationModal}
					title='Confirmar Exclusão'
					message='Tem certeza de que deseja excluir este campo?'
					onConfirm={confirmDeleteField}
					onCancel={() => setConfirmationModal(false)}
					icon={<FaTrash size={16} />}
					defaultClassName={true}
				/>
			</section>
		</>
	);
};

export default HomePage;
