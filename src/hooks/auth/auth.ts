import { useUser } from "../user/user"
import { useLoginMutation, useLogoutMutation } from "./queries";
import { getLocalTokens, resetLocalTokens, setLocalTokens } from "../../services/token-service";


const useAuth = () => {
    const { updateUser, clearUser } = useUser();
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();

    const login = async () => {
        try {
            const res = await loginMutation.mutateAsync({
                email: "test@2mail.com",
                password: "123123123"
            });
            
            if (res) {
                await setLocalTokens({
                    accessToken: res.access_token,
                    refreshToken: res.refresh_token
                }); 

                updateUser(res.user);
            }

        } catch(error) {
            console.error(error);
        }
    }

    const logout = async () => {
        try {
            const tokens = await getLocalTokens();
            if (tokens) {
                await logoutMutation.mutateAsync(tokens.accessToken);
                await logoutMutation.mutateAsync(tokens.refreshToken);
            }
                await resetLocalTokens();
                clearUser();
        } catch(error) {
            console.error(error)
        }
    }

    return {
        login,
        logout,
    }
}

export { useAuth };