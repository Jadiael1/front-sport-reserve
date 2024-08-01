export interface IReport {
	date: string;
	value: number;
	total_reservations?: number;
	total_amount?: string;
	total_transactions?: number;
	total_users?: number;
	field_id?: number;
}
