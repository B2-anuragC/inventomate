import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
import { ApiResponse } from './types';
// dayjs.extend(utc);

export type ISendResponse = (
  data: unknown,
  status: number,
  debug?: any
) => ApiResponse;

export const formatResponse: ISendResponse = (data, status, debug?: any) => {
  let obj = {
    resCode: status,
    data: data,
    timeStamp: Date(),
  };
  if (debug) Object.assign(obj, { debug });
  return obj;
};

export const generateOTP = (): number => {
  return Math.round(Math.random() * (999999 - 100000) + 100000);
};

export const currentDate = (isMilli: boolean, date?: null) => {
  const utcTime = dayJsDate();
  return isMilli !== true ? utcTime : utcTime.valueOf();
};

export const dayJsDate = () => {
  return dayjs();
};

interface AxiosConfig<T = any> {
  url: string;
  requestType: string;
  method?: string;
  data?: any;
  headers?: any;
}
async function makeRequest<T>(
  config: AxiosConfig<T>
): Promise<AxiosResponse<T>> {
  try {
    return axios.request<T>(config);
  } catch (error) {
    console.error('Axios request failed:', error);
    throw error;
  }
}
