import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../../navigations/RootNavigation/RootNavigation';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BaseLayout } from '../../components/layout/BaseLayout';
import { Header } from '../../components/Header/Header';
import { useSocket } from '../../contexts/SocketContext/SocketContext';
import { Player } from '../../models/player';
import { PlayerList } from './components/PlayerList/PlayerList';
import { StatusActionBar } from './components/StatusActionBar/StatusActionBar';
import { NonExistentRoom } from './components/NonExistentRoom/NonExistentRoom';
import { RoomInfoBar } from './components/RoomInfoBar/RoomInfoBar';

type GameRoomScreenProps = NativeStackScreenProps<RootStackParams, 'GameRoom'>;

const GameRoomScreen = ({ route }: GameRoomScreenProps): JSX.Element => {
  const { currentRoom, getGame, getPlayer } = useSocket();

  const game = getGame(route.params.gameId);

  const playerIds: Player['socketId'][] = currentRoom?.playerIds ?? [];
  const players = playerIds.map(playerId => getPlayer(playerId));

  if (!game) {
    return <NonExistentRoom />;
  }
  return (
    <>
      <BaseLayout scroll={false}>
        <Header />
        <RoomInfoBar game={game} />
        <View style={styles.playersContainer}>
          <PlayerList data={players} game={game} />
        </View>
      </BaseLayout>
      <StatusActionBar game={game} />
    </>
  );
};

type Styles = {
  playersContainer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  playersContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingBottom: 100,
  },
});

export { GameRoomScreen };
