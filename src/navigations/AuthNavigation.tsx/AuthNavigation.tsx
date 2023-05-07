import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../../screens/LoginScreen/LoginScreen";
import { RegisterScreen } from "../../screens/RegisterScreen/RegisterScreen";

type AuthStackParams = {
    Login: undefined;
    Register: undefined;
}

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const AuthStackNavigation = (): JSX.Element => {
    return (
            <AuthStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false }}>                
                <AuthStack.Screen name="Login" component={LoginScreen} />
                <AuthStack.Screen name="Register" component={RegisterScreen} />
            </AuthStack.Navigator>
    )
}

export { AuthStackNavigation, type AuthStackParams };