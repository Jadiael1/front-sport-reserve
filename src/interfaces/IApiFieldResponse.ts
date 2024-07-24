import { IApiResponse } from './IApiResponse';
import { IField } from './IField';
import { IPaginatedData } from './IPaginatedData';

export interface IApiFieldResponse extends IApiResponse<IPaginatedData<IField>> {}
