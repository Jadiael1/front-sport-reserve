import { IReservation } from './IReservation';

export interface IPayments {
	id: number;
	reservation_id: number;
	amount: number;
	status: string;
	payment_date: string;
	url: string;
	response?: string;
	checkout_id: string;
	charge_id: string;
	self_url: string;
	inactivate_url: string;
	response_payment: string;
	reservation: IReservation;
}
