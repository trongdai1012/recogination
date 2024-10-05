import {axiosWithAuth} from './apiClient';
import {EndpointApiV1} from './endpoint';

export const getListEmployee = async (): Promise<any> => {
  try {
    const url = `${EndpointApiV1.EmployeeAll}`;
    const response = await axiosWithAuth.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching private data', JSON.stringify(error));
    throw error;
  }
};
