import React from 'react';
import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {Header} from '../../components/Header/Header';
import {useState} from 'react';
import {TextInput, Portal, Modal} from 'react-native-paper';
import {Button} from '../../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ZodType, z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSocket} from '../../contexts/SocketContext/SocketContext';
import {useUser} from '../../hooks/user/user';
import Toast from 'react-native-toast-message';
import { RoomResource } from '../../models/room';
import { Game, GameSettingsResource } from '../../models/game';

type LobbyScreenProps = NativeStackScreenProps<RootStackParams, 'Lobby'>;

export type CreateRoomForm = {
  name: RoomResource['name'];
  password?: RoomResource['password'];
  max_players: GameSettingsResource['max_players'];
  lives: GameSettingsResource['lives'];
  turn_time_seconds: GameSettingsResource['turn_time_seconds'];
};

const createRoomSchema: ZodType<CreateRoomForm> = z.object({
  name: z.string().min(1).max(20),
  password: z.coerce.string().min(3).max(99).optional(),
  max_players: z.coerce.number().int().min(3).max(8),
  lives: z.coerce.number().int().min(1).max(10),
  turn_time_seconds: z.coerce.number().int().min(10).max(120),
});

const LobbyScreen = ({navigation}: LobbyScreenProps): JSX.Element => {
  const {user} = useUser();
  const {socketIO, games, currentGame, getPlayer, getRoom} = useSocket();
  const [visible, setVisible] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: `${user?.profile.full_name.split(' ')[0]}'s Room`,
      password: '12345',
      lives: 3,
      max_players: 8,
      turn_time_seconds: 100,
    },
  });


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const createRoom = (data: CreateRoomForm) => {
    socketIO.emit('create_game_room', data);
    setVisible(false);
    reset();
  };

  const joinRoom = (gameId: Game['id']) => {
    if (!currentGame?.id) {
      socketIO.emit('join_game_room', { game_id: gameId });

    } else if (currentGame?.id === gameId) {
      navigation.navigate('GameRoom', {gameId: gameId});

    } else {
        Toast.show({
          type: 'error',
          text1: 'You are already in a room!',
        });
    }
  };

  return (
    <BaseLayout>
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
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.createRoomModal}>
            <Text
              style={{
                color: '#FFF',
                marginBottom: 20,
                fontWeight: '700',
                fontSize: 18,
              }}>
              CREATE NEW ROOM
            </Text>
            <View style={{marginBottom: 20}}>
              <Controller
                control={control}
                name="name"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    mode="outlined"
                    label="Room name *"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    outlineColor="#FFF"
                    activeOutlineColor="#FFF"
                    textColor="#FFF"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                    dense
                  />
                )}
              />
              {errors.name && (
                <Text style={{color: '#FFF'}}>{errors.name.message}</Text>
              )}
            </View>

            <View style={{marginBottom: 20}}>
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    mode="outlined"
                    label="Room password (optional)"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    outlineColor="#FFF"
                    activeOutlineColor="#FFF"
                    textColor="#FFF"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                    dense
                  />
                )}
              />
              {errors.password && (
                <Text style={{color: '#FFF'}}>{errors.password.message}</Text>
              )}
            </View>

            <View style={{marginBottom: 20}}>
              <Controller
                control={control}
                name="max_players"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    mode="outlined"
                    label="Max number of players"
                    keyboardType="number-pad"
                    inputMode="numeric"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value?.toString()}
                    outlineColor="#FFF"
                    activeOutlineColor="#FFF"
                    textColor="#FFF"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                    dense
                  />
                )}
              />
              {errors.max_players && (
                <Text style={{color: '#FFF'}}>
                  {errors.max_players.message}
                </Text>
              )}
            </View>

            <View style={{marginBottom: 20}}>
              <Controller
                control={control}
                name="lives"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    mode="outlined"
                    label="Number of lives"
                    keyboardType="number-pad"
                    inputMode="numeric"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value?.toString()}
                    outlineColor="#FFF"
                    activeOutlineColor="#FFF"
                    textColor="#FFF"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                    dense
                  />
                )}
              />
              {errors.lives && (
                <Text style={{color: '#FFF'}}>{errors.lives.message}</Text>
              )}
            </View>

            <View style={{marginBottom: 30}}>
              <Controller
                control={control}
                name="turn_time_seconds"
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    mode="outlined"
                    label="Time per round (seconds)"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    value={value?.toString()}
                    outlineColor="#FFF"
                    activeOutlineColor="#FFF"
                    textColor="#FFF"
                    style={{backgroundColor: 'rgba(255, 255, 255, 0)'}}
                    dense
                  />
                )}
              />
              {errors.turn_time_seconds && (
                <Text style={{color: '#FFF'}}>
                  {errors.turn_time_seconds.message}
                </Text>
              )}
            </View>

            <Button
              mode="contained"
              style={{padding: 4}}
              buttonColor="#FFF"
              textColor="#56947A"
              onPress={handleSubmit(createRoom)}>
              Create room
            </Button>
          </Modal>
        </Portal>
        <Button
          mode="contained"
          style={{justifyContent: 'center', flex: 0}}
          onPress={showModal}>
          <Icon name="plus" size={20} />
        </Button>
      </View>
      {Object.keys(games)?.length > 0 ? (
        <View>
          {Object.values(games).map((game: Game) => (
            getRoom(game?.roomId) ? (
              <Pressable
                onPress={() => joinRoom(game.id)}
                key={game.roomId}
                style={{
                  backgroundColor: '#4D8B71',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                  borderColor:
                    game.roomId === currentGame?.roomId ? '#FFD362' : '',
                  borderWidth: game.roomId === currentGame?.roomId ? 1 : 0,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <View
                    style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Text
                      style={{color: '#FFF', fontWeight: '700', fontSize: 20}}>
                      {getRoom(game.roomId).name}
                    </Text>
                    {getRoom(game.roomId).password ? <Icon name="lock" /> : null}
                  </View>
                  <Text style={{color: 'white'}}>
                    {getPlayer(getRoom(game?.roomId)?.ownerId)?.user?.profile?.nickname?.substring(0, 10)}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', gap: 30}}>
                  <View
                    style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                    <Icon name="users" color="#FFF" />
                    <Text style={{color: '#FFF'}}>
                      {game.settings.maxPlayers}
                    </Text>
                  </View>
                  <View
                    style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                    <Icon name="heart" color="#FFF" />
                    <Text style={{color: '#FFF'}}>{game.settings.lives}</Text>
                  </View>
                  <View
                    style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                    <Icon name="clock" color="#FFF" />
                    <Text style={{color: '#FFF'}}>
                      {game.settings.turnTimeSeconds}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ) : null
          ))}
        </View>
      ) : (
        <View>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 24,
              textAlign: 'center',
            }}>
            No rooms available :(
          </Text>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 20,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Be the first one to create a room! :D
          </Text>
        </View>
      )}
    </BaseLayout>
  );
};

type Styles = {
  roomInputs: ViewStyle;
  input: ViewStyle;
  createRoomModal: ViewStyle;
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
  createRoomModal: {
    backgroundColor: '#56947A',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export {LobbyScreen};
