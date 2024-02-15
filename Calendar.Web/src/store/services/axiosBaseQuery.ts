import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';


type BaseQueryType = {
    baseUrl: string,
    baseHeaders?: AxiosRequestConfig['headers']
}

type AxiosRequestQueryType = {
    url: string,
    method?: AxiosRequestConfig['method'],
    data?: AxiosRequestConfig['data'],
    params?: AxiosRequestConfig['params'],
    headers?: AxiosRequestConfig['headers']
}

const axiosBaseQuery = ({ baseUrl = '', baseHeaders }: BaseQueryType): BaseQueryFn<AxiosRequestQueryType> => {

    var axiosRequestFn = async({ url, method, data, params, headers }: AxiosRequestQueryType) => {

        try {
            const requestUrl = baseUrl + url;
            const requestHeaders: AxiosRequestConfig['headers'] = { ... baseHeaders, ...headers };

            const result = await axios({ url: requestUrl, method, data, params, headers: requestHeaders });

            return { data: result.data }
        }
        catch(axiosError){
            
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message
                }
            }
        }
    }
    
    return axiosRequestFn;
}

export default axiosBaseQuery;
