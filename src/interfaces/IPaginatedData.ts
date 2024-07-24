import { IPaginationLink } from './IPaginationLink';

export interface IPaginatedData<T> {
	current_page: number;
	data: T[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	next_page_url: string | null;
	links: IPaginationLink[];
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}
