import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {
  Dimensions,
  ImageStyle,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Modal, Portal, Text} from 'react-native-paper';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {Header} from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../hooks/user/user';
import {Image} from 'react-native';
import {FullUserResource} from '../../api/auth/auth';
import {Button} from '../../components/Button';
import {useSocket} from '../../contexts/SocketContext/SocketContext';
import {EventArg, useNavigation} from '@react-navigation/native';

type GameRoomScreenProps = NativeStackScreenProps<RootStackParams, 'GameRoom'>;

type EventData = {
  action: Readonly<{
    type: string;
    payload?: object | undefined;
    source?: string | undefined;
    target?: string | undefined;
  }>;
};

const {width} = Dimensions.get('window');

const GameRoomScreen = ({route}: GameRoomScreenProps): JSX.Element => {
  const navigation = useNavigation();
  const {gameRoomSocket} = useSocket();

  const room = route.params.gameRoom;
  const {user} = useUser();
  const [visible, setVisible] = useState<boolean>(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const exitEvent = useRef<EventArg<'beforeRemove', true, EventData>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      event.preventDefault();

      if (event.data.action.type !== 'GO_BACK') {
        navigation.dispatch(event.data.action);
      } else {
        exitEvent.current = event;
        showModal();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const confirmLeaveRoom = () => {
    if (exitEvent.current) {
      navigation.dispatch(exitEvent.current.data.action);
    }
  };

  if (!user) {
    return (
      <View>
        <Text>User not found</Text>
      </View>
    );
  }

  const generateMockedUsers = (amount: number): FullUserResource[] => {
    const mockedUsers: FullUserResource[] = [];

    for (let i = 0; i < amount; i++) {
      mockedUsers.push({
        ...user,
        id: i.toString(),
        profile: {
          ...user.profile,
          nickname: `mock_user_${i}`,
        },
      });
    }

    return mockedUsers;
  };

  const onLeaveRoom = () => {
    gameRoomSocket.emit('leave_game_room', room);
    confirmLeaveRoom();
  };

  const players: FullUserResource[] = [user, ...generateMockedUsers(7)];

  return (
    <>
      <BaseLayout>
        <Header />
        <View style={styles.roomInfo}>
          <View style={{marginBottom: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              <Text style={styles.title}>{room.name}</Text>
              <Pressable
                style={{
                  backgroundColor: '#4D8B71',
                  padding: 10,
                  borderRadius: 4,
                }}
                onPress={showModal}>
                <MaterialIcon
                  size={24}
                  color="#FFF"
                  name="exit-run"
                  style={{transform: [{scaleX: -1}]}}
                />
              </Pressable>
            </View>
            {room.password ? (
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Icon name="lock" />
                <Text>{room.password}</Text>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: '#FFF'}}>
              {
                players.find(player => player.id === room.player_id)?.profile
                  .nickname
              }
            </Text>
            <View style={{flexDirection: 'row', gap: 30}}>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Icon name="users" color="#FFF" size={16} />
                <Text style={{color: '#FFF'}}>
                  {players.length}/{room.max_players}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Icon name="heart" color="#FFF" size={16} />
                <Text style={{color: '#FFF'}}>{room.hearts}</Text>
              </View>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Icon name="clock" color="#FFF" size={16} />
                <Text style={{color: '#FFF'}}>{room.turn_time_seconds}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.playersContainer}>
          {players.map((player: FullUserResource) => (
            <View
              key={player.id}
              style={{
                backgroundColor: '#4D8B71',
                borderRadius: 10,
                padding: 4,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Image
                style={styles.avatar}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                resizeMode="contain"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                  paddingHorizontal: 10,
                }}>
                <Text style={{color: '#FFF'}}>{player?.profile.nickname}</Text>
                {room.player_id === player.id ? (
                  <Text style={{color: '#FFF', fontWeight: '700'}}>OWNER</Text>
                ) : Math.random() > 0.5 ? (
                  <Text style={{color: '#5AE381', fontWeight: '700'}}>
                    READY
                  </Text>
                ) : (
                  <Text style={{color: '#FFD362', fontWeight: '700'}}>
                    WAITING
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </BaseLayout>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(45, 52, 61, 0.95)',
          position: 'absolute',
          bottom: 0,
          width: width,
          padding: 20,
        }}>
        <Text style={{color: '#FFF', marginBottom: 20}}>
          Waiting everyone to get ready...
        </Text>
        <Button
          mode="contained"
          buttonColor="#00B4EB"
          style={{paddingHorizontal: 10, paddingVertical: 5}}>
          <Text style={{fontWeight: '700', color: '#FFF'}}>START GAME</Text>
        </Button>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.leaveRoomModal}>
          <Text
            style={{
              color: '#FFF',
              marginBottom: 20,
              fontWeight: '700',
              fontSize: 18,
            }}>
            LEAVE ROOM
          </Text>
          <Text style={{color: '#FFF', marginBottom: 20, fontSize: 18}}>
            Are you sure you want to leave the room{' '}
            <Text style={{fontWeight: '700', color: '#FFF', fontSize: 18}}>
              {room.name}
            </Text>
            ?
          </Text>
          <Button
            mode="contained"
            style={{padding: 4}}
            buttonColor="#FFF"
            textColor="#56947A"
            onPress={onLeaveRoom}>
            LEAVE ROOM
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

type Styles = {
  avatar: ImageStyle;
  roomInfo: ViewStyle;
  title: TextStyle;
  playersContainer: ViewStyle;
  leaveRoomModal: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#56947A',
  },
  roomInfo: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
  },
  playersContainer: {
    paddingVertical: 20,
    paddingBottom: 100,
  },
  leaveRoomModal: {
    backgroundColor: '#56947A',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export {GameRoomScreen};
