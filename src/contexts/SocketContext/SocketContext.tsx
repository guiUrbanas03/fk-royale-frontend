import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type GameState,
  socketIO,
  GameObject,
  PlayerObject,
  RoomObject,
  GameStateResource,
  GamePayloadResource,
  RemovedGameResource,
} from '../../socketio';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import { Player, PlayerResource } from '../../models/player';
import { Game } from '../../models/game';
import { Room } from '../../models/room';
import { toGame } from '../../transformers/game-transformer';
import { toPlayer } from '../../transformers/player-transformer';
import { toRoom } from '../../transformers/room-transformer';

type SocketContextValue = {
  games: GameObject;
  players: PlayerObject;
  rooms: RoomObject;
  socketIO: typeof socketIO;
  currentPlayer?: Player;
  currentGame?: Game;
  currentRoom?: Room;
  logState: () => void;
  getPlayer: (playerId: string) => Player;
  getGame: (gameId: string) => Game;
  getRoom: (roomId: string) => Room;

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

  const [gameState, setGameState] = useState<GameState>({
    games: {},
    players: {},
    rooms: {},
  });

  const getPlayer = (playerId: string): Player => {
    return gameState.players[playerId];
  }

  const getGame = (gameId: string): Game => {
    return gameState.games[gameId];
  }

  const getRoom = (roomId: string): Room => {
    return gameState.rooms[roomId];
  }

  const currentPlayer = getPlayer(socketIO.id);
  const currentGame = currentPlayer?.currentGameId ? getGame(currentPlayer.currentGameId) : undefined;
  const currentRoom = currentGame?.roomId ? getRoom(currentGame.roomId) : undefined;

  const logState = () => {
    console.log(
      '---> GAME STATE: ',
      JSON.stringify(
        {
          games: gameState.games ?? 'N/D',
          players: gameState.players ?? 'N/D',
          rooms: gameState.rooms ?? 'N/D',
          currentPlayer: currentPlayer ?? 'N/D',
          currentGame: currentGame ?? 'N/D',
          currentRoom: currentRoom ?? 'N/D',

        },
        null,
        4,
      ),
    );
  };

  const isCurrentPlayer = (socketId: string): boolean => {
    return socketIO.id === socketId;
  }

  useEffect(() => {
    logState();
  }, [gameState]);

  useEffect(() => {
    const handleConnectSocket = () => {
      console.log(`[GAME ROOM]: player ${socketIO.id} connected.`);
    };

    const handleDisconnectSocket = () => {
      console.log(`[GAME ROOM]: player ${socketIO.id} disconnected.`);
    };

    const handleFetchState = (data: GameStateResource) => {
      setGameState({
        games: Object.entries(data.games).reduce(
          (prev: GameObject, [key, game]) => {
            prev[key] = toGame(game);
            return prev;
          },
          {},
        ),
        players: Object.entries(data.players).reduce(
          (prev: PlayerObject, [key, player]) => {
            prev[key] = toPlayer(player);
            return prev;
          },
          {},
        ),
        rooms: Object.entries(data.rooms).reduce(
          (prev: RoomObject, [key, room]) => {
            prev[key] = toRoom(room);
            return prev;
          },
          {},
        ),
      });
    };

    const handleAddPlayer = (data: PlayerResource) => {
      console.log(
        `[GAME ROOM]: new player connected ${data.socket_id}.`,
      );

      setGameState(prev => ({
        ...prev,
        players: {...prev.players, [data.socket_id]: toPlayer(data)},
      }));
    };

    const handleAddGame = (data: GamePayloadResource) => {
      console.log(`[GAME ROOM]: new room ${socketIO.id} created ${data.game.id}.`);

      const player = toPlayer(data.player);
      const game = toGame(data.game);
      const room = toRoom(data.room);

      setGameState(prev => ({
        ...prev,
        players: {...prev.players, [player.socketId]: player},
        games: {...prev.games, [game.id]: game},
        rooms: {...prev.rooms, [room.id]: room}
      }));

      if (isCurrentPlayer(player.socketId)) {
        navigation.navigate('GameRoom', {gameId: game.id});
      }
    };

    const handleAddPlayerToRoom = (data: GamePayloadResource) => {
      console.log(
        `[GAME ROOM]: Player ${data.player.socket_id} entering room ${data.room.id}.`,
      );

      setGameState(prev => ({
        players: {...prev.players, [data.player.socket_id]: toPlayer(data.player)},
        games: {...prev.games, [data.game.id]: toGame(data.game)},
        rooms: {...prev.rooms, [data.room.id]: toRoom(data.room)}
      }));

      if (isCurrentPlayer(data.player.socket_id)) {
        navigation.navigate('GameRoom', {gameId: data.game.id});
      }
    };

    const handleRemovePlayerFromRoom = (data: GamePayloadResource) => {
      setGameState(prev => ({
        players: { ...prev.players, [data.player.socket_id]: toPlayer(data.player)},
        games: {...prev.games, [data.game.id]: toGame(data.game)},
        rooms: {...prev.rooms, [data.room.id]: toRoom(data.room)}
      }));

      if (isCurrentPlayer(data.player.socket_id)) {
        navigation.navigate('Lobby');
      }
    };

    const handleRemoveGame = (data: RemovedGameResource) => {
      console.log(`[GAME ROOM]: new room ${socketIO.id} removed ${data.game.id}.`);

      setGameState((prev) => {
        const updatedGameState = { ...prev };
  
        delete updatedGameState.games[data.game.id];
        delete updatedGameState.rooms[data.room.id];
  
        data.players.forEach((playerResource) => {
          const player = toPlayer(playerResource);
          updatedGameState.players[player.socketId] = player;
        });
  
        return updatedGameState;
      });
    };

    socketIO.on('connect', handleConnectSocket);
    socketIO.on('disconnect', handleDisconnectSocket);
    socketIO.on('fetch_state', handleFetchState);
    socketIO.on('add_player', handleAddPlayer);
    socketIO.on('add_game', handleAddGame);
    socketIO.on('remove_game', handleRemoveGame);
    socketIO.on('add_player_to_room', handleAddPlayerToRoom);
    socketIO.on('remove_player_from_room', handleRemovePlayerFromRoom);

    return () => {
      socketIO.off('connect', handleConnectSocket);
      socketIO.off('disconnect', handleDisconnectSocket);
      socketIO.off('fetch_state', handleFetchState);
      socketIO.off('add_player', handleAddPlayer);
      socketIO.off('add_game', handleAddGame);
      socketIO.off('remove_game', handleRemoveGame);
      socketIO.off('add_player_to_room', handleAddPlayerToRoom);
      socketIO.off('remove_player_from_room', handleRemovePlayerFromRoom);
      socketIO.disconnect();
    };
  }, []);

  const value: SocketContextValue = {
    socketIO: socketIO,
    games: gameState.games,
    players: gameState.players,
    rooms: gameState.rooms,
    currentPlayer: currentPlayer,
    currentGame: currentGame,
    currentRoom: currentRoom,
    logState: logState,
    getPlayer: getPlayer,
    getGame: getGame,
    getRoom: getRoom,

  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, useSocket};
