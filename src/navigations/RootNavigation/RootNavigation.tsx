import React from 'react';
import {ProfileScreen} from '../../screens/ProfileScreen/ProfileScreen';
import {LobbyScreen} from '../../screens/LobbyScreen/LobbyScreen';
import {HelpScreen} from '../../screens/HelpScreen/HelpScreen';
import {GameRoomScreen} from '../../screens/GameRoomScreen/GameRoomScreen';
import {AuthStackNavigation} from '../AuthNavigation.tsx/AuthNavigation';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {adaptNavigationTheme, useTheme} from 'react-native-paper';
import {useUser} from '../../hooks/user/user';
import {type GameRoom} from '../../models/game-room';
import {SocketProvider} from '../../contexts/SocketContext/SocketContext';

type RootStackParams = {
  Profile: undefined;
  Lobby: undefined;
  Help: undefined;
  GameRoom: {gameRoom: GameRoom};
  AuthStackNavigation: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParams>();
const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const RootStackNavigation = (): JSX.Element => {
  const {user, isLoading} = useUser();
  const theme = useTheme();

  return (
    <NavigationContainer
      theme={{
        ...LightTheme,
        colors: {
          ...LightTheme.colors,
          background: theme.colors.primary,
        },
      }}>
      <SocketProvider>
        <RootStack.Navigator
          initialRouteName="Lobby"
          screenOptions={{headerShown: false}}>
          {user != null && !isLoading ? (
            <>
              <RootStack.Screen name="Profile" component={ProfileScreen} />
              <RootStack.Screen name="Lobby" component={LobbyScreen} />
              <RootStack.Screen name="GameRoom" component={GameRoomScreen} />
            </>
          ) : (
            <>
              <RootStack.Screen
                name="AuthStackNavigation"
                component={AuthStackNavigation}
              />
            </>
          )}
          <RootStack.Screen name="Help" component={HelpScreen} />
        </RootStack.Navigator>
      </SocketProvider>
    </NavigationContainer>
  );
};

export {RootStackNavigation, type RootStackParams};
