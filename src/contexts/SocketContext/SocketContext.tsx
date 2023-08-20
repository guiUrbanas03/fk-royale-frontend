import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {gameRoomSocket} from '../../socketio';
import {GameRoom} from '../../models/game-room';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';

type SocketContextValue = {
  rooms: GameRoom[];
  gameRoomSocket: typeof gameRoomSocket;
  currentRoom?: GameRoom;
};

type SocketProviderProps = {
  children: ReactNode;
};

const SocketContext = createContext<SocketContextValue>(
  {} as SocketContextValue,
);
const useSocket = () => useContext<SocketContextValue>(SocketContext);

const SocketProvider = ({children}: SocketProviderProps): JSX.Element => {
  const navigation: NativeStackNavigationProp<RootStackParams> =
    useNavigation();
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | undefined>(
    undefined,
  );

  useEffect(() => {
    const handleConnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${gameRoomSocket.id} connected.`);
    };

    const handleDisconnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${gameRoomSocket.id} disconnected.`);
    };

    const handleCreateGameRoom = (data: GameRoom) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} joined room ${data.id}`,
      );
      const room = new GameRoom(data);

      setRooms(prev => [...prev, room]);
      setCurrentRoom(room);
      navigation.navigate('GameRoom', {gameRoom: data});
    };

    const handleLeaveGameRoom = (data: GameRoom) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} left room ${data.id}.`,
      );
      setRooms(prev => prev.filter(gameRoom => gameRoom.id !== data.id));
      setCurrentRoom(undefined);
      navigation.navigate('Lobby');
    };

    gameRoomSocket.on('connect', handleConnectGameRoom);
    gameRoomSocket.on('disconnect', handleDisconnectGameRoom);
    gameRoomSocket.on('create_game_room', handleCreateGameRoom);
    gameRoomSocket.on('leave_game_room', handleLeaveGameRoom);

    return () => {
      gameRoomSocket.off('connect', handleConnectGameRoom);
      gameRoomSocket.off('disconnect', handleDisconnectGameRoom);
      gameRoomSocket.off('create_game_room', handleCreateGameRoom);
      gameRoomSocket.off('leave_game_room', handleLeaveGameRoom);
    };
  }, []);

  const value: SocketContextValue = {
    rooms: rooms,
    gameRoomSocket: gameRoomSocket,
    currentRoom: currentRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, useSocket};
