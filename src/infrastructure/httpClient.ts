import { ApiError } from './api.errors';

interface HttpClientConfig extends RequestInit {
    timeout?: number;
}

const DEFAULT_TIMEOUT = 5000;

export async function httpClient<T>(url: string, config: HttpClientConfig = {}) : Promise<T> {
    const {timeout = DEFAULT_TIMEOUT, headers, ...restConfig} = config;

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);


    try{
        const response = await fetch(url, {
            ...restConfig,
            signal: abortController.signal,
            headers:{
                'Content-Type': 'application/json',
                ...headers
            }
        });

        clearTimeout(timeoutId);

        if(!response.ok){
            const errorData: unknown = await response.json().catch(() => ({}));

            const internalCode = 
                errorData && typeof errorData === 'object' && 'code' in errorData
                    ? String((errorData as any).code)
                    : 'UNKNOWN_SERVER_ERROR';


            throw new ApiError(response.status, internalCode, `HTTP error! status: ${response.status}`);

        }
        
        return await response.json() as T;
    }catch(error: unknown){
        clearTimeout(timeoutId);

        if(error instanceof ApiError && error.name === 'AbortError'){
            throw new ApiError(408, 'REQUEST_TIMEOUT', 'La api tardo demasiado en responder');
        }

        throw error;
    }

}