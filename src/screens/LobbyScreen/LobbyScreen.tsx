import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {Header} from '../../components/Header/Header';
import {useState} from 'react';
import {TextInput} from 'react-native-paper';
import {useSocket} from '../../contexts/SocketContext/SocketContext';
import { GameRoomList } from './components/GameRoomList/GameRoomList';
import { GameRoomForm } from './components/GameRoomForm/GameRoomForm';
import { Game } from '../../models/game';
import { PreviewRoomModal } from './components/PreviewRoomModal/PreviewRoomModal';

type LobbyScreenProps = NativeStackScreenProps<RootStackParams, 'Lobby'>;

const LobbyScreen = ({}: LobbyScreenProps): JSX.Element => {
  const { games } = useSocket();
  const [previewGame, setPreviewGame] = useState<Game>();

  return (
    <BaseLayout scroll={false}>
      <Header />
      <View style={styles.roomInputs}>
        <TextInput
          mode="outlined"
          outlineColor="#56947A"
          textColor="#FFF"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          placeholder="Search for room or player"
          style={styles.input}
        />        
        <PreviewRoomModal previewGame={previewGame} setPreviewGame={setPreviewGame} />
        <GameRoomForm />
      </View>
      <GameRoomList data={Object.values(games)} onPressItem={setPreviewGame} />
    </BaseLayout>
  );
};

type Styles = {
  roomInputs: ViewStyle;
  input: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  roomInputs: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    flex: 1,
  },
});

export {LobbyScreen};
