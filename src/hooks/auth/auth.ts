import { useUser } from "../user/user"
import { useLoginMutation, useLogoutMutation } from "./queries";
import { getLocalTokens, resetLocalTokens, setLocalTokens } from "../../services/token-service";
import Toast from 'react-native-toast-message';


const useAuth = () => {
    const { updateUser, clearUser } = useUser();
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();

    const login = async (email: string, password: string) => {
        try {
            const res = await loginMutation.mutateAsync({
                email,
                password
            });
            
            if (res) {
                await setLocalTokens({
                    accessToken: res.access_token,
                    refreshToken: res.refresh_token
                }); 

                updateUser(res.user);
                Toast.show({
                    type: 'success',
                    text1: `Welcome, ${res.user.email}!`,
                });
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