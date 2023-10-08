import React from 'react';
import {Game} from '../../../../models/game';
import {Pressable, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSocket} from '../../../../contexts/SocketContext/SocketContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

type GameRoomItemProps = {
  game: Game;
  onPress: Function;
};

const GameRoomItem = ({game, onPress}: GameRoomItemProps): JSX.Element => {
  const {getPlayer, getRoom, currentGame} = useSocket();

  const room = getRoom(game.roomId);
  const player = getPlayer(room.ownerId);

  return (
    <Pressable
      onPress={() => onPress(game)}
      key={game.roomId}
      style={{
        backgroundColor: '#4D8B71',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderColor: game.roomId === currentGame?.roomId ? '#FFD362' : '',
        borderWidth: game.roomId === currentGame?.roomId ? 1 : 0,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Text style={{color: '#FFF', fontWeight: '700', fontSize: 20}}>
            {room.name}
          </Text>
          {room.password ? <Icon name="lock" /> : null}
        </View>
        <Text style={{color: 'white'}}>
          {player?.user?.profile?.nickname?.substring(0, 10)}
        </Text>
      </View>
      <View style={{flexDirection: 'row', gap: 30}}>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <Icon name="users" color="#FFF" />
          <Text style={{color: '#FFF'}}>{game.settings.maxPlayers}</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <Icon name="heart" color="#FFF" />
          <Text style={{color: '#FFF'}}>{game.settings.lives}</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <Icon name="clock" color="#FFF" />
          <Text style={{color: '#FFF'}}>{game.settings.turnTimeSeconds}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export {GameRoomItem};
