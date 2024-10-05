import {axiosWithAuth} from './apiClient';
import {EndpointApiV1} from './endpoint';

export const submitRecoginationFace = async (
  formData: FormData,
): Promise<any> => {
  try {
    const response = await axiosWithAuth.post(
      EndpointApiV1.RecognizeFace,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error('Error register face data', JSON.stringify(error));
    throw error;
  }
};
