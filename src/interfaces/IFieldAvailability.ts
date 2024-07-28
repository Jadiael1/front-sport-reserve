export interface IFieldAvailability {
	id: number;
	field_id: number;
	day_of_week: string;
	start_time: string;
	end_time: string;
	created_at: string | null;
	updated_at: string | null;
}
