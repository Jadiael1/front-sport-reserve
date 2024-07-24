import { IImage } from './IImage';

export interface IField {
	id: number;
	name: string;
	location: string;
	type: string;
	hourly_rate: string | number;
	created_at: string | null;
	updated_at: string | null;
	images: IImage[];
}
