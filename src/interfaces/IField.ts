import { IImage } from './IImage';

export interface IField {
	id: number;
	name: string;
	location: string;
	type: string;
	hourly_rate: string | number;
	status: 'active' | 'inactive';
	cep: string;
	district: string;
	address: string;
	number: string;
	city: string;
	uf: string;
	complement: string;
	created_at: string | null;
	updated_at: string | null;
	images: IImage[];
}
