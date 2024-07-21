export interface IImage {
	id: number;
	field_id: number;
	path: string;
	created_at: string;
	updated_at: string;
}

export interface IPaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

// Interface para o objeto Field
export interface IField {
	id: number;
	name: string;
	location: string;
	type: string;
	hourly_rate: number;
	created_at?: string;
	updated_at?: string;
	images: IImage[];
}

// Interface para os dados de paginação
export interface IPaginationData {
	current_page: number;
	data: IField[];
	first_page_url: string;
	from: number | null;
	last_page: number;
	last_page_url: string;
	links: IPaginationLink[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number | null;
	total: number;
}

// Interface para a resposta da API
export interface IApiResponse {
	status: string;
	message: string;
	data: IPaginationData;
	errors: any | null;
}

export interface FieldDetailsProps {
	field: {
		id: string;
		name: string;
		location: string;
		type: string;
		hourly_rate: number;
	};
}
