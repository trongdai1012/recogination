import {SubmitLoginResponse} from '../types/login/login';
import {axiosWithoutAuth} from './apiClient';
import {EndpointApiV1} from './endpoint';

export const submitLogin = async (
  tenant: string,
  username: string,
  password: string,
): Promise<SubmitLoginResponse> => {
  try {
    const data = `username=${username}&password=${password}&grant_type=password`;

    const response = await axiosWithoutAuth.post(EndpointApiV1.Login, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Basic ' + btoa('employee:corona-employee'),
        Origin: 'https://erp.m2m-sol.co.jp',
        'X-Tenant': tenant,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Referer: 'https://erp.m2m-sol.co.jp/auth/login?returnUrl=%2F',
      },
    });
    return response.data as SubmitLoginResponse;
  } catch (error) {
    console.error('Error fetching private data Login', JSON.stringify(error));
    throw error;
  }
};
