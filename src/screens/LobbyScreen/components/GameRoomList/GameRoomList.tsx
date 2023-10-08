import React from 'react';
import { FlatList, ListRenderItem, StyleSheet, TextStyle, View } from 'react-native';
import { Game } from '../../../../models/game';
import { GameRoomItem } from '../GameRoomItem/GameRoomItem';
import { Text } from 'react-native-paper';

type GameRoomListProps = {
  data: ArrayLike<Game>;
  onPressItem: Function;
};

const EmptyState = () => (
  <View>
    <Text style={styles.primaryText}>No rooms available :(</Text>
    <Text style={styles.secondaryText}>Be the first one to create a room! :D</Text>
  </View>
);

const GameRoomList = ({ data, onPressItem }: GameRoomListProps): JSX.Element => {
  const renderGameItem: ListRenderItem<Game> = ({ item: game }) => (
    <GameRoomItem game={game} onPress={onPressItem} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderGameItem}
      keyExtractor={(game: Game) => game.id}
      ListEmptyComponent={<EmptyState />}
    />
  );
};

type Styles = {
  primaryText: TextStyle;
  secondaryText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  primaryText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 24,
    textAlign: 'center',
  },

  secondaryText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  }
});


export { GameRoomList };
