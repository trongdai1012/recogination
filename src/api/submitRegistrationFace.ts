import {axiosWithAuth} from './apiClient';
import {EndpointApiV1} from './endpoint';

// Hàm gọi API không cần xác thực
export const submitRegistrationFace = async (
  formData: FormData,
): Promise<any> => {
  try {
    const response = await axiosWithAuth.post(
      EndpointApiV1.RegisterFace,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error('Error register face data', JSON.stringify(error));
    throw error;
  }
};
