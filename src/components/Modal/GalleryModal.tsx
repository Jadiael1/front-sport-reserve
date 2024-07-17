import ModalImage from 'react-modal-image';

export const GalleryModal = ({ images }) => {
	return (
		<div>
			{images.map((image, index) => (
				<ModalImage
					key={index}
					small={image} // URL da imagem pequena (opcional, pode ser a mesma da large)
					large={image} // URL da imagem grande (obrigatório)
					alt={`Imagem ${index + 1}`} // Texto alternativo da imagem
					hideDownload // Oculta o botão de download (opcional)
				/>
			))}
		</div>
	);
};
