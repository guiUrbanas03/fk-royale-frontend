import { useQuery, useMutation } from "@tanstack/react-query";
import { login, whoAmI, logout, LoginUserForm, register, RegisterFormData } from "../../api/auth/auth";

const useRegisterMutation = () => {
    return useMutation({
        mutationKey: ["user", "create"],
        mutationFn: (registerData: RegisterFormData) => register(registerData).then(res => res?.data),
        onError: (error: any) => console.error("Register error: ", error),
    });
}

const useLoginMutation = () => {
    return useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: (loginData: LoginUserForm) => login(loginData).then(res => res?.data),
        onError: (error: any) => console.error("Login error: ", error),
    });
}

const useWhoAmIQuery = () => {
    return useQuery({
        queryKey: ["auth", "whoami"],
        queryFn: () => whoAmI().then((res) => res),
    })
}

const useLogoutMutation = () => {
    return useMutation({
        mutationKey: ["auth", "logout"],
        mutationFn: (token: string) => logout(token).then((res) => res),
    })
}

export { useRegisterMutation, useLoginMutation, useLogoutMutation, useWhoAmIQuery };