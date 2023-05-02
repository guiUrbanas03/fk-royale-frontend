import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../../screens/LoginScreen/LoginScreen";

type AuthStackParams = {
    Login: undefined;
}

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const AuthStackNavigation = (): JSX.Element => {
    return (
            <AuthStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false }}>                
                <AuthStack.Screen name="Login" component={LoginScreen} />
            </AuthStack.Navigator>
    )
}

export { AuthStackNavigation, type AuthStackParams };