import { useQuery, useMutation } from "@tanstack/react-query";
import { login, whoAmI, logout, LoginUserForm } from "../../api/auth/auth";

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
        queryFn: () => whoAmI().then((res) => res?.data),
    })
}

const useLogoutMutation = () => {
    return useMutation({
        mutationKey: ["auth", "logout"],
        mutationFn: (token: string) => logout(token).then((res) => res),
    })
}

export { useLoginMutation, useLogoutMutation, useWhoAmIQuery };