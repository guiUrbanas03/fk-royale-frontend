import { useUser } from "../user/user"
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "./queries";
import { getLocalTokens, resetLocalTokens, setLocalTokens } from "../../services/token-service";
import Toast from 'react-native-toast-message';
import { RegisterFormData } from "../../api/auth/auth";


const useAuth = () => {
    const { updateUser, clearUser } = useUser();
    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();
    const registerMutation = useRegisterMutation();

    const register = async (registerData: RegisterFormData) => {
        try {
            const res = await registerMutation.mutateAsync(registerData);

            if (res) { 
                await login(registerData.user.email, registerData.user.password);
            }
        } catch(error) {
            console.error(error)
        }
    }

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

                updateUser({...res.user, profile: res.profile, game_stats: res.game_stats});

                Toast.show({
                    type: 'success',
                    text1: `Welcome, ${res.profile.full_name.split(" ")[0]}!`,
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
        
        register,
        login,
        logout,
    }
}

export { useAuth };