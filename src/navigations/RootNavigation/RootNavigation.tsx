import { ProfileScreen } from '../../screens/ProfileScreen/ProfileScreen';
import { LobbyScreen } from '../../screens/LobbyScreen/LobbyScreen'; 
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { adaptNavigationTheme } from 'react-native-paper';
import { HelpScreen } from '../../screens/HelpScreen/HelpScreen';
import { AuthStackNavigation } from '../AuthNavigation.tsx/AuthNavigation';
import { useUser } from '../../hooks/user/user';

type RootStackParams = {
    Profile: undefined;
    Lobby: undefined;
    Help: undefined;
    AuthStackNavigation: undefined
}

const RootStack = createNativeStackNavigator<RootStackParams>();
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

const RootStackNavigation = (): JSX.Element => {
    const { user } = useUser();

    return (
        <NavigationContainer theme={LightTheme}>
            <RootStack.Navigator initialRouteName="Profile" screenOptions={{headerShown: false }}> 
                {
                    user != null ? (
                        <>
                            <RootStack.Screen name="Profile" component={ProfileScreen} />   
                            <RootStack.Screen name="Lobby" component={LobbyScreen} />
                        </>
                    ) : (
                        <>
                            <RootStack.Screen name="AuthStackNavigation" component={AuthStackNavigation} />
                        </>
                    )
                }
                <RootStack.Screen name="Help" component={HelpScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    )
}

export { RootStackNavigation, type RootStackParams };