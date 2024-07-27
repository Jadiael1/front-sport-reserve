import { IField } from './IField';
import { IUser } from './IUser';

export interface IReservation {
	id: number;
	user_id: number;
	field_id: number;
	start_time: string;
	end_time: string;
	created_at: string;
	updated_at: string;
	status: string;
	field: IField;
	user: IUser;
}
