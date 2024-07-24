export interface IApiResponse<T> {
	status: string;
	message: string;
	data: T;
	errors?: string | { [key: string]: string[] } | null;
}
