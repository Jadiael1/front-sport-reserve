import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
	FaUpload,
	FaHashtag,
	FaFlag,
	FaCity,
	FaBuilding,
	FaMapMarkerAlt,
	FaPlus,
	FaRoad,
	FaMoneyBill,
	FaTag,
	FaEdit,
} from 'react-icons/fa';
import Navbar from '../../components/common/NavBar/NavBar';
import { Map, MapMouseEvent, AdvancedMarker, useApiIsLoaded } from '@vis.gl/react-google-maps';

const containerStyle = {
	width: '100%',
	height: '400px',
};

const initialCenter = {
	lat: -8.6855317,
	lng: -35.5914402,
};

const FieldForm = () => {
	const { token } = useAuth();
	const [name, setName] = useState('');
	const [location, setLocation] = useState<{ lat: number; lng: number } | null>(initialCenter);
	const [type, setType] = useState('');
	const [hourlyRate, setHourlyRate] = useState('');
	const [images, setImages] = useState<FileList | null>(null);
	const [cep, setCep] = useState('');
	const [district, setDistrict] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [uf, setUF] = useState('');
	const [number, setNumber] = useState('');
	const [complement, setComplement] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const apiIsLoaded = useApiIsLoaded();

	const handleMapClick = useCallback((event: MapMouseEvent) => {
		if (event.detail.latLng) {
			const location = {
				lat: event.detail.latLng.lat,
				lng: event.detail.latLng.lng,
			};
			setLocation(location);
			const geocoder = new window.google.maps.Geocoder();
			geocoder.geocode({ location }, (results, status) => {
				if (status === 'OK') {
					if (results && results[0]) {
						const address = results[0].address_components.filter(result => result.types.includes('route'));
						const city = results[0].address_components.filter(
							result => result.types.some(type => ['administrative_area_level_2'].includes(type)), // , 'political'
						);
						const uf = results[0].address_components.filter(
							result => result.types.some(type => ['administrative_area_level_1'].includes(type)), // , 'political'
						);
						const cep = results[0].address_components.filter(result =>
							result.types.some(type => ['postal_code'].includes(type)),
						);
						if (address && address.length) setAddress(address[0].long_name);
						if (city && city.length) setCity(city[0].long_name);
						if (uf && uf.length) setUF(uf[0].long_name);
						if (cep && cep.length) setCep(cep[0].long_name);
					} else {
						console.log('Nenhum resultado encontrado');
					}
				}
			});
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage(null);
		setError(null);

		if (!location) {
			setError('Por favor, selecione uma localização no mapa ou insira a latitude e longitude manualmente.');
			return;
		}

		const formData = new FormData();
		formData.append('name', name);
		formData.append('location', JSON.stringify(location));
		formData.append('type', type);
		formData.append('hourly_rate', hourlyRate);
		formData.append('cep', cep);
		formData.append('district', district);
		formData.append('address', address);
		formData.append('city', city);
		formData.append('uf', uf);
		formData.append('number', number);
		formData.append('complement', complement);
		if (images) {
			Array.from(images).forEach(image => {
				formData.append('images[]', image);
			});
		}

		try {
			const response = await fetch(`${baseURL}/fields`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				},
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				setMessage('Campo criado com sucesso!');
				setTimeout(() => navigate('/'), 3000);
			} else {
				setError(data.message || 'Falha ao salvar o campo.');
			}
		} catch (error) {
			setError('Falha ao salvar o campo.');
		}
	};

	return (
		<>
			<Navbar />
			<section className='w-full bg-background min-h-screen flex justify-center items-center'>
				<div className='max-w-3xl w-full bg-background border border-gray-200 p-8 rounded-lg shadow-lg my-2'>
					<h1 className='text-3xl font-bold text-center mb-8'>Insira uma nova arena</h1>
					{message && <div className='text-green-500 mb-4'>{message}</div>}
					{error && <div className='text-red-500 mb-4'>{error}</div>}
					<form
						onSubmit={handleSubmit}
						className='grid grid-cols-1 md:grid-cols-2 gap-6'
					>
						<div className='relative col-span-1 md:col-span-2'>
							<label
								htmlFor='name'
								className='text-sm text-gray-600'
							>
								<FaEdit className='inline-block mr-2' /> Nome da arena
							</label>
							<input
								id='name'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={name}
								onChange={e => setName(e.target.value)}
							/>
						</div>
						<div className='col-span-1 md:col-span-2'>
							<h3 className='text-sm text-gray-600 mb-2'>Selecione a localização no mapa:</h3>
							{apiIsLoaded ?
								<Map
									style={containerStyle}
									defaultCenter={initialCenter}
									defaultZoom={14}
									gestureHandling='satellite2'
									disableDefaultUI={true}
									mapId='MAP_SR_ID'
									onClick={handleMapClick}
									id='MAP_SR_ID'
								>
									{location && (
										<AdvancedMarker
											position={location}
											clickable={true}
											title='clickable google.maps.Marker'
											onDrag={() => null}
										/>
									)}
								</Map>
							:	<div>
									<p className='text-sm text-gray-600 mb-2'>
										<a
											href='https://support.google.com/maps/answer/18539?hl=pt-BR&co=GENIE.Platform'
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-500 hover:underline'
										>
											Como encontrar latitude e longitude no Google Maps
										</a>
									</p>
									<div className='flex flex-col md:flex-row gap-4'>
										<input
											type='text'
											placeholder='Latitude'
											className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
											value={location ? location.lat : ''}
											onChange={e => setLocation({ ...location!, lat: parseFloat(e.target.value) })}
										/>
										<input
											type='text'
											placeholder='Longitude'
											className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
											value={location ? location.lng : ''}
											onChange={e => setLocation({ ...location!, lng: parseFloat(e.target.value) })}
										/>
									</div>
								</div>
							}
						</div>
						<div className='relative'>
							<label
								htmlFor='type'
								className='text-sm text-gray-600'
							>
								<FaTag className='inline-block mr-2' /> Modalidade
							</label>
							<input
								id='type'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={type}
								onChange={e => setType(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='hourlyRate'
								className='text-sm text-gray-600'
							>
								<FaMoneyBill className='inline-block mr-2' /> Valor por hora
							</label>
							<input
								id='hourlyRate'
								type='number'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={hourlyRate}
								onChange={e => setHourlyRate(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='cep'
								className='text-sm text-gray-600'
							>
								<FaMapMarkerAlt className='inline-block mr-2' /> CEP
							</label>
							<input
								id='cep'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={cep}
								onChange={e => setCep(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='district'
								className='text-sm text-gray-600'
							>
								<FaBuilding className='inline-block mr-2' /> Bairro
							</label>
							<input
								id='district'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={district}
								onChange={e => setDistrict(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='address'
								className='text-sm text-gray-600'
							>
								<FaRoad className='inline-block mr-2' /> Endereço
							</label>
							<input
								id='address'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={address}
								onChange={e => setAddress(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='number'
								className='text-sm text-gray-600'
							>
								<FaHashtag className='inline-block mr-2' /> Número
							</label>
							<input
								id='number'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={number}
								onChange={e => setNumber(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='city'
								className='text-sm text-gray-600'
							>
								<FaCity className='inline-block mr-2' /> Cidade
							</label>
							<input
								id='city'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={city}
								onChange={e => setCity(e.target.value)}
							/>
						</div>
						<div className='relative'>
							<label
								htmlFor='uf'
								className='text-sm text-gray-600'
							>
								<FaFlag className='inline-block mr-2' /> Estado
							</label>
							<input
								id='uf'
								type='text'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={uf}
								onChange={e => setUF(e.target.value)}
							/>
						</div>
						<div className='relative col-span-1 md:col-span-2'>
							<label
								htmlFor='complement'
								className='text-sm text-gray-600'
							>
								<FaBuilding className='inline-block mr-2' /> Complemento
							</label>
							<textarea
								id='complement'
								className='mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
								required
								value={complement}
								onChange={e => setComplement(e.target.value)}
							/>
						</div>
						<div className='relative col-span-1 md:col-span-2 mx-auto'>
							<label
								htmlFor='file-upload'
								className='flex items-center cursor-pointer mt-3'
							>
								<div className='flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300'>
									<FaUpload className='mr-2' />
									Escolher imagens
								</div>
								<input
									id='file-upload'
									name='file-upload'
									type='file'
									className='sr-only'
									multiple
									onChange={e => setImages(e.target.files)}
								/>
							</label>
							<p className='text-sm text-gray-500 mt-2'>
								OBS: <span className='font-normal'>Máximo 5 imagens</span>
							</p>
							{images && images.length > 0 && (
								<span className='text-gray-500 text-sm ml-2'>{images.length} imagem(ns) selecionada(s)</span>
							)}
						</div>
						<div className='flex flex-col md:flex-row justify-between col-span-1 md:col-span-2 gap-4 mt-6 mx-auto w-full'>
							<button
								type='submit'
								className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center justify-center'
							>
								<FaPlus className='mr-2' />
								Criar arena
							</button>
						</div>
					</form>
				</div>
			</section>
		</>
	);
};

export default FieldForm;
