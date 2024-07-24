import { IApiResponse } from './IApiResponse';
import { IPaginatedData } from './IPaginatedData';
import { IReservation } from './IReservation';

export interface IApiReservationResponse extends IApiResponse<IPaginatedData<IReservation>> {}
