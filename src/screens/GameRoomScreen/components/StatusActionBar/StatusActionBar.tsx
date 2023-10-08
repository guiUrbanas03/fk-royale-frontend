import React from 'react'
import { Dimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../../../../components/Button';
import { useSocket } from '../../../../contexts/SocketContext/SocketContext';
import { Game } from '../../../../models/game';

type StatusActionBarProps = {
  game: Game;
}

const StatusActionBar = ({ game }: StatusActionBarProps): JSX.Element => {
  const { width } = Dimensions.get('window');
  const { socketIO, getRoom } = useSocket();
  const room = getRoom(game.roomId);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(45, 52, 61, 0.95)',
        position: 'absolute',
        bottom: 0,
        width: width,
        padding: 20,
      }}>
      <Text style={{ color: '#FFF', marginBottom: 20 }}>
        Waiting everyone to get ready...
      </Text>
      {room.ownerId === socketIO.id ? (
        <Button
          mode="contained"
          buttonColor="#00B4EB"
          style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ fontWeight: '700', color: '#FFF' }}>START GAME</Text>
        </Button>
      ) : (
        <Button
          mode="contained"
          buttonColor="#5ADE81"
          style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text style={{ fontWeight: '700', color: '#FFF' }}>I'M READY</Text>
        </Button>
      )}
    </View>
  )
}

export { StatusActionBar };