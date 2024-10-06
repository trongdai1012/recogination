import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegistrationApiResponse} from '../types/registerFace/registerFace';

export const submitRecoginationFace = async (
  formData: FormData,
): Promise<RegistrationApiResponse> => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const tenant = await AsyncStorage.getItem('tenantStore');
    const res = await axios.post(
      'http://192.168.1.21:8080/v1/face-detect/recognizeFace',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
          'X-Tenant': tenant,
        },
      },
    );
    return res.data as RegistrationApiResponse;
  } catch (error) {
    console.log('Error register face data', JSON.stringify(error));
    throw error;
  }
};
