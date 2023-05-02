import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { JwtCause, getLocalTokens, resetLocalTokens, setLocalTokens } from "../../services/token-service";
import { refreshAccessToken } from "../../api/auth/auth";
import { API, ErrorResponse } from "../../api";
import { useEffect } from "react";

const attachTokenInRequest = async (config: InternalAxiosRequestConfig) => {
    const tokens = await getLocalTokens();
    const withoutToken = ["/auth/refresh", "/auth/logout"];

    if (tokens && config.url && !withoutToken.includes(config.url)) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    
    return config;
}

const refreshTokenThenRetryRequest = async (responseError: AxiosError<ErrorResponse>, clearUser: () => void) => {
    const isNotUnauthorized: boolean = responseError.response?.status !== 401;
    const isNotAccessTokenExpired: boolean = responseError.response?.data.cause.data !== JwtCause.ACCESS_TOKEN_EXPIRED;

    if (isNotUnauthorized || isNotAccessTokenExpired ) { 
        return Promise.reject(responseError); 
    }

    try {
        const tokens = await getLocalTokens();

        if (!tokens || !responseError?.config) { 
            return Promise.reject(responseError); 
        }

        const res = await refreshAccessToken(tokens.refreshToken);
        
        if (res) {
            await setLocalTokens({
                accessToken: res.data.access_token,
                refreshToken: tokens.refreshToken
            });
        }
        
        return await API(responseError.config);

    } catch (refreshError) {
        await resetLocalTokens();
        clearUser();
        return Promise.reject(responseError);
    }
}


const useAuthInterceptors = (clearUser: () => void) => {
    useEffect(() => {
        const requestInterceptor = API.interceptors.request.use(attachTokenInRequest);
        
        const responseInterceptor = API.interceptors.response.use(
            (response: AxiosResponse) => response,
            (responseError: AxiosError<ErrorResponse>) => refreshTokenThenRetryRequest(responseError, clearUser)
        );
        
        return () => {
            API.interceptors.request.eject(requestInterceptor);
            API.interceptors.response.eject(responseInterceptor);
        }
    }, [])
}

export { useAuthInterceptors };