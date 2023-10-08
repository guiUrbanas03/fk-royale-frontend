import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Button, Modal, Portal, Text} from 'react-native-paper';
import {Game} from '../../../../models/game';
import {useSocket} from '../../../../contexts/SocketContext/SocketContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../../../navigations/RootNavigation/RootNavigation';

type PreviewRoomModalProps = {
  previewGame: Game|undefined;
  setPreviewGame: React.Dispatch<React.SetStateAction<Game | undefined>>;
};

const PreviewRoomModal = ({
  previewGame,
  setPreviewGame,
}: PreviewRoomModalProps): JSX.Element|null => {
  const {socketIO, currentGame, getRoom, getPlayer} = useSocket();
  const navigation: NativeStackNavigationProp<RootStackParams> = useNavigation();

  const previewRoom = previewGame ? getRoom(previewGame.roomId) : undefined;
  const previewOwner = previewRoom ? getPlayer(previewRoom.ownerId) : undefined;

  const joinRoom = (gameId: Game['id']) => {
    if (!currentGame?.id) {
      socketIO.emit('join_game_room', {game_id: gameId});

    } else if (currentGame?.id === gameId) {
      navigation.navigate('GameRoom', {gameId: gameId});
      
    } else {
      Toast.show({
        type: 'error',
        text1: 'You are already in a room!',
      });
    }
    setPreviewGame(undefined);
  };

  if (!previewGame || !previewRoom || !previewOwner) {
    return null;
  }

  return (
    <Portal>
      <Modal
        visible={previewGame != null}
        onDismiss={() => setPreviewGame(undefined)}
        contentContainerStyle={styles.modal}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}>
          <Text style={{color: '#FFF', fontWeight: '700', fontSize: 20}}>
            {previewRoom.name}
          </Text>
          {previewRoom.password ? <Icon name="lock" /> : null}
        </View>
        <Text style={{color: '#FFF', marginBottom: 20}}>
          {previewOwner.user.profile.nickname}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 30,
            borderBottomColor: 'rgba(255, 255, 255, 0.3)',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginBottom: 24,
          }}>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <Icon size={16} name="users" color="#FFF" />
            <Text style={{color: '#FFF', fontSize: 16}}>
              {previewRoom.playerIds.length}/{previewGame.settings.maxPlayers}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <Icon size={16} name="heart" color="#FFF" />
            <Text style={{color: '#FFF', fontSize: 16}}>
              {previewGame.settings.lives}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <Icon size={16} name="clock" color="#FFF" />
            <Text style={{color: '#FFF', fontSize: 16}}>
              {previewGame.settings.turnTimeSeconds}
            </Text>
          </View>
        </View>
        <Button
          mode="contained"
          style={{padding: 4}}
          buttonColor="#FFF"
          textColor="#56947A"
          onPress={() => joinRoom(previewGame.id)}>
          {currentGame?.id === previewGame.id ? 'RETURN TO ROOM' : 'JOIN ROOM'}
        </Button>
      </Modal>
    </Portal>
  );
};

type Styles = {
    modal: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    modal: {
        backgroundColor: '#56947A',
        padding: 20,
        margin: 20,
        borderRadius: 10,
      },
});

export {PreviewRoomModal};
