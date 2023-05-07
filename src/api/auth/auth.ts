import axios, { AxiosResponse } from "axios";
import { API } from "../index";


type LoginUserForm = {
    email: string;
    password: string;
}

type UserResource = {
    id: string;
    email: string;
} 

type RevokedTokenResource = {
    id: string;
    user_id: string;
    type_: string;
}

type LoginResponse = {
    access_token: string;
    refresh_token: string;
    user: UserResource;
    message: string;
}

type UserResponse = {
    message: string;
    user: UserResource;
}

type RefreshTokenResponse = {
    message: string;
    access_token: string;
}

type LogoutResponse = {
    message: string,
    revoked_token: RevokedTokenResource
}

const login = async (formData: LoginUserForm): Promise<AxiosResponse<LoginResponse>|void> => {
    try {
        const res = await API.post<LoginResponse>("/auth/login", formData);
        return res;
    } catch(error) {
        logApiError("Login", error);
    }
}

const whoAmI = async (): Promise<AxiosResponse<UserResponse>|void> => {
    try {
        const res = await API.get<UserResponse>("/auth/who-am-i");

        return res;
    } catch(error) {
        logApiError("WhoAmI", error);

        if (axios.isAxiosError(error)) {
            // console.log("error axios: ", error.toJSON());
        }
    }
}

const refreshAccessToken = async (refreshToken: string): Promise<AxiosResponse<RefreshTokenResponse>|void> => {
    try {
        const res = API.post<RefreshTokenResponse>("/auth/refresh", {},
            { headers: {
                Authorization: `Bearer ${refreshToken}`
            }}
        );
        return res;
    } catch(error) {
        logApiError("Refresh Token", error);
    }
}

const logout = async (token: string): Promise<AxiosResponse<LogoutResponse>|void> => {
    try {
        const res = await API.delete<LogoutResponse>("/auth/logout", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch(error) {
        logApiError("Logout", error);
    }
}


const logApiError = (errorName: string, error: any): void => {
    console.info(`[API] ${errorName} error: ${error}`);
}

export { 
    login, 
    logout, 
    refreshAccessToken,
    whoAmI,
    type LoginUserForm,
    type UserResource
 };
