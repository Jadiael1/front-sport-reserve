import React, { useState, useEffect, useRef } from 'react';
import './assets/main.css';

interface CarouselProps {
	children: React.ReactNode[];
	className?: string;
	autoplay?: boolean;
	arrows?: boolean;
	autoplaySpeed?: number;
}

const Carousel: React.FC<CarouselProps> = ({
	children,
	className,
	autoplay = true,
	arrows = true,
	autoplaySpeed = 4000,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const slidesCount = children.length;
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const resetTimeout = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	useEffect(() => {
		if (autoplay) {
			resetTimeout();
			timeoutRef.current = setTimeout(
				() => setCurrentIndex(prevIndex => (prevIndex === slidesCount - 1 ? 0 : prevIndex + 1)),
				autoplaySpeed,
			);

			return () => {
				resetTimeout();
			};
		}
	}, [currentIndex, autoplay, autoplaySpeed, slidesCount]);

	const nextSlide = () => {
		setCurrentIndex(prevIndex => (prevIndex === slidesCount - 1 ? 0 : prevIndex + 1));
	};

	const prevSlide = () => {
		setCurrentIndex(prevIndex => (prevIndex === 0 ? slidesCount - 1 : prevIndex - 1));
	};

	return (
		<div className={`carousel ${className}`}>
			<div
				className='carousel-inner'
				style={{ transform: `translateX(${-currentIndex * 100}%)` }}
			>
				{children}
			</div>
			{arrows ?
				<button
					className='carousel-control prev'
					onClick={prevSlide}
				>
					&#10094;
				</button>
			:	null}
			{arrows ?
				<button
					className='carousel-control next'
					onClick={nextSlide}
				>
					&#10095;
				</button>
			:	null}
		</div>
	);
};

export default Carousel;
