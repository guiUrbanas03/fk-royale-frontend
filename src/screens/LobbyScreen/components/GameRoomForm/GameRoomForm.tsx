import React, { useState } from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import { Modal, Portal, Text, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '../../../../hooks/user/user';
import { useSocket } from '../../../../contexts/SocketContext/SocketContext';
import { ZodType, z } from 'zod';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RoomResource } from '../../../../models/room';
import { GameSettingsResource } from '../../../../models/game';

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


const GameRoomForm = (): JSX.Element => {
    const [showCreateRoomModal, setShowCreateRoomModal] = useState<boolean>(false);
    const {user} = useUser();
    const {socketIO} = useSocket();

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

      const createRoom = (data: CreateRoomForm) => {
        socketIO.emit('create_game_room', data);
        setShowCreateRoomModal(false);
        reset();
      };

  return (
    <>
        <Button
          mode="contained"
          style={{justifyContent: 'center', flex: 0}}
          onPress={() => setShowCreateRoomModal(true)}
        >
            <Icon name="plus" size={20} />
        </Button>
        <Portal>
          <Modal
            visible={showCreateRoomModal}
            onDismiss={() => setShowCreateRoomModal(false)}
            contentContainerStyle={styles.modal}>
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
    </>
  );
};


type Styles = {
   modal: ViewStyle;
};
  
  const styles = StyleSheet.create<Styles>({   
    modal: {
        backgroundColor: '#56947A',
        padding: 20,
        margin: 20,
        borderRadius: 10,
      },
  });
  

export {GameRoomForm};
