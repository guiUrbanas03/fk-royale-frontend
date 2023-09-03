import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {type State, gameRoomSocket} from '../../socketio';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {Game, GameSettings} from '../../models/game';
import {Room} from '../../models/room';
import {Player} from '../../models/player';

type SocketContextValue = {
  games: Game[];
  gameRoomSocket: typeof gameRoomSocket;
  currentGame?: Game;
  currentPlayer?: Player;
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

  const [gameState, setGameState] = useState<State>({
    games: [],
    current_player: undefined,
  });

  useEffect(() => {
    console.log('---> FETCH STATE: ', gameState.games);
  }, [gameState]);

  useEffect(() => {
    const handleConnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${gameRoomSocket.id} connected.`);
    };

    const handleDisconnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${gameRoomSocket.id} disconnected.`);
    };

    const handleCreateGameRoom = (data: Game) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} created room ${data.id}`,
      );

      const room: Room = new Room(data.room);
      const settings: GameSettings = new GameSettings(data.settings);
      const game = new Game({id: data.id, room: room, settings: settings});

      navigation.navigate('GameRoom', {game: game});
    };

    const handleFetchState = (data: State) => {
      if (data.current_player) {
        setGameState({
          games: data.games.map(game => Game.buildGame(game)),
          current_player: Player.buildPlayer(data.current_player),
        });
      }
    };

    const handleJoinGameRoom = (data: Game) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} joined room ${data.id}`,
      );

      navigation.navigate('GameRoom', {game: data});
    };

    const handleLeaveGameRoom = (data: Game) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} left room ${data.id}.`,
      );

      navigation.navigate('Lobby');
    };

    gameRoomSocket.on('connect', handleConnectGameRoom);
    gameRoomSocket.on('disconnect', handleDisconnectGameRoom);
    gameRoomSocket.on('create_game_room', handleCreateGameRoom);
    gameRoomSocket.on('join_game_room', handleJoinGameRoom);
    gameRoomSocket.on('leave_game_room', handleLeaveGameRoom);
    gameRoomSocket.on('fetch_state', handleFetchState);

    return () => {
      gameRoomSocket.off('connect', handleConnectGameRoom);
      gameRoomSocket.off('disconnect', handleDisconnectGameRoom);
      gameRoomSocket.off('create_game_room', handleCreateGameRoom);
      gameRoomSocket.off('join_game_room', handleJoinGameRoom);
      gameRoomSocket.off('leave_game_room', handleLeaveGameRoom);
      gameRoomSocket.off('fetch_state', handleFetchState);
      gameRoomSocket.disconnect();
    };
  }, []);

  const value: SocketContextValue = {
    games: gameState.games,
    currentPlayer: gameState.current_player,
    gameRoomSocket: gameRoomSocket,
    currentGame: gameState.current_player?.current_game,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, useSocket};
