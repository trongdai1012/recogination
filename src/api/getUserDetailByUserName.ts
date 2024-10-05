import {EmployeeDetailResponse} from '../types/login/login';
import {axiosWithAuth} from './apiClient';
import {EndpointApiV1} from './endpoint';

export const getUserDetailByUserName = async (
  username: string,
): Promise<EmployeeDetailResponse> => {
  try {
    const url = `${EndpointApiV1.UserDetail}/${username}`;
    const response = await axiosWithAuth.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching private data', JSON.stringify(error));
    throw error;
  }
};
