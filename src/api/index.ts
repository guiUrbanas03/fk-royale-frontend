import axios from "axios";
import Config from "react-native-config";

type ErrorResponse<T=any> = {
    name: string;
    code: number;
    cause: {
        data: T,
        type: string,
    };
}

enum CauseType {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    DATA_VIOLATION_ERROR = "DATA_VIOLATION",
    TOKEN_ERROR = "TOKEN_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
}

const API = axios.create({
    baseURL: Config.API_URL,
    responseType: "json",

    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
})

export { 
    API, 
    CauseType,
    type ErrorResponse,
};