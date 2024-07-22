declare module 'react-modal-image' {
	import * as React from 'react';

	interface ModalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
		small?: string;
		smallSrcSet?: string;
		medium?: string;
		large?: string;
		alt?: string;
		hideDownload?: boolean;
		hideZoom?: boolean;
		showRotate?: boolean;
		imageBackgroundColor?: string;
		className?: string;
	}

	interface LightboxProps extends ModalImageProps {
		onClose?: () => void;
	}

	declare class ModalImage extends React.Component<ModalImageProps> {}
	declare class Lightbox extends React.Component<LightboxProps> {}

	export default ModalImage;
	export { Lightbox };
}
