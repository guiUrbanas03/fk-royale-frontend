import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { FAB, useTheme } from 'react-native-paper';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigations/RootNavigation/RootNavigation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useUser } from '../../hooks/user/user';

type BaseLayoutProps = {
  children: React.ReactNode;
  scroll?: boolean;
};

const BaseLayout = ({ children, scroll = true }: BaseLayoutProps): JSX.Element => {
  const theme = useTheme();
  const navigation: NativeStackNavigationProp<RootStackParams> =
    useNavigation();
  const { currentGame, currentRoom } = useSocket();
  const { user } = useUser();

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.linearGradient}>
      <SafeAreaView style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView
            style={{ padding: 20 }}
            contentInsetAdjustmentBehavior="automatic">
            {children}
          </ScrollView>
        ) : (
          <View style={{ padding: 20, flex: 1 }}>
            {children}
          </View>
        )}
        {currentGame && user ? (
          <FAB
            icon={() => <FontAwesome5Icon name="home" color="#FFF" size={20} />}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              left: 20,
              backgroundColor: '#56947A',
              flexWrap: 'wrap',
              flex: 1,
              borderRadius: 10,
              justifyContent: 'center',
            }}
            label={`Return to ${currentRoom?.name}`}
            onPress={() =>
              navigation.navigate('GameRoom', { gameId: currentGame.id })
            }
            color="#FFF"
            uppercase={true}
          />
        ) : null}
      </SafeAreaView>

      {/* <View style={styles.cardsBackground}>
            <CardsBackgroundSVG />
        </View> */}
    </LinearGradient>
  );
};

type Styles = {
  linearGradient: ViewStyle;
  cardsBackground: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  linearGradient: {
    flex: 1,
  },
  cardsBackground: {
    position: 'absolute',
    bottom: 0,
    opacity: 0.4,
    zIndex: 0,
  },
});

export { BaseLayout };
