import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type GameState,
  gameRoomSocket,
  GameObject,
  PlayerObject,
  GameAndRoom,
} from '../../socketio';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {Game, GameSettings} from '../../models/game';
import {Room} from '../../models/room';
import {Player} from '../../models/player';

type SocketContextValue = {
  games: GameObject;
  players: PlayerObject;
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

  const [gameState, setGameState] = useState<GameState>({
    games: {},
    players: {},
    current_player: undefined,
  });

  useEffect(() => {
    console.log(
      '---> FETCH STATE: ',
      Object.values(gameState.games).map(game => game.room.name),
    );
  }, [gameState]);

  useEffect(() => {
    const handleConnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${gameRoomSocket.id} connected.`);
    };

    const handleDisconnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${gameRoomSocket.id} disconnected.`);
    };

    const handleFetchState = (data: GameState) => {
      setGameState({
        games: Object.entries(data.games).reduce(
          (prev: GameObject, [key, game]) => {
            prev[key] = Game.buildGame(game);
            return prev;
          },
          {},
        ),

        players: Object.entries(data.players).reduce(
          (prev: PlayerObject, [key, game]) => {
            prev[key] = Player.buildPlayer(game);
            return prev;
          },
          {},
        ),

        current_player: data.current_player
          ? Player.buildPlayer(data.current_player)
          : undefined,
      });
    };

    const handleCreateGameRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} created room ${data.game.room.id}`,
      );

      const room: Room = new Room(data.game.room);
      const settings: GameSettings = new GameSettings(data.game.settings);
      const game = new Game({id: data.game.id, room: room, settings: settings});

      setGameState(prev => ({
        ...prev,
        current_player: Player.buildPlayer(data.player),
      }));

      navigation.navigate('GameRoom', {gameId: game.id});
    };

    const handleJoinGameRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: player ${gameRoomSocket.id} joined room ${data.game.room.id}`,
      );

      if (gameRoomSocket.id === data.player.socket_id) {
        setGameState(prev => ({
          ...prev,
          current_player: Player.buildPlayer(data.player),
        }));

        navigation.navigate('GameRoom', {gameId: data.game.id});
      }
    };

    const handleLeaveGameRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: player ${data.player.socket_id} left room ${data.game.room.id}.`,
      );

      if (gameRoomSocket.id === data.player.socket_id) {
        setGameState(prev => ({
          ...prev,
          current_player: Player.buildPlayer(data.player),
        }));

        navigation.navigate('Lobby');
      }
    };

    const handleAddPlayer = (data: Player) => {
      console.log(
        `[GAME ROOM]: new player ${gameRoomSocket.id} connected ${data.socket_id}.`,
      );

      setGameState(prev => ({
        ...prev,
        players: {...prev.players, [data.socket_id]: Player.buildPlayer(data)},
      }));
    };

    const handleAddGame = (data: Game) => {
      console.log(
        `[GAME ROOM]: new room ${gameRoomSocket.id} created ${data.id}.`,
      );

      setGameState(prev => ({
        ...prev,
        games: {...prev.games, [data.id]: Game.buildGame(data)},
      }));
    };

    const handleRemoveGame = (data: Game) => {
      // console.log(
      //   `[GAME ROOM]: new room ${gameRoomSocket.id} created ${data.id}.`
      // );
      // console.log("-------> ROOM: ", data.room.name);
      // console.log("-------> GAMES: ", gameState.games);
      // const filteredGames: GameObject = {};
      // Object.keys(gameState.games).forEach((key) => {
      //   const game = gameState.games[key];
      //   if (game.id !== data.id) {
      //     filteredGames[key] = game;
      //   }
      // });
      // console.log("NEW GAMES: ",  filteredGames);
      // setGameState((prev) => ({
      //   ...prev,
      //   games: filteredGames
      // }));
    };

    const handleAddToRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: Player ${data.player.socket_id} entering room ${data.game.room.id}.`,
      );

      setGameState(prev => ({
        ...prev,
        games: {...prev.games, [data.game.id]: Game.buildGame(data.game)},
        players: {
          ...prev.players,
          [data.player.socket_id]: Player.buildPlayer(data.player),
        },
      }));
    };

    const handleRemoveFromRoom = (data: GameAndRoom) => {
      setGameState(prev => ({
        ...prev,
        games: {...prev.games, [data.game.id]: Game.buildGame(data.game)},
        players: {
          ...prev.players,
          [data.player.socket_id]: Player.buildPlayer(data.player),
        },
      }));
    };

    gameRoomSocket.on('connect', handleConnectGameRoom);
    gameRoomSocket.on('disconnect', handleDisconnectGameRoom);
    gameRoomSocket.on('create_game_room', handleCreateGameRoom);
    gameRoomSocket.on('join_game_room', handleJoinGameRoom);
    gameRoomSocket.on('leave_game_room', handleLeaveGameRoom);
    gameRoomSocket.on('fetch_state', handleFetchState);
    gameRoomSocket.on('add_player', handleAddPlayer);
    gameRoomSocket.on('add_game', handleAddGame);
    gameRoomSocket.on('remove_game', handleRemoveGame);
    gameRoomSocket.on('add_to_room', handleAddToRoom);
    gameRoomSocket.on('remove_from_room', handleRemoveFromRoom);

    return () => {
      gameRoomSocket.off('connect', handleConnectGameRoom);
      gameRoomSocket.off('disconnect', handleDisconnectGameRoom);
      gameRoomSocket.off('create_game_room', handleCreateGameRoom);
      gameRoomSocket.off('join_game_room', handleJoinGameRoom);
      gameRoomSocket.off('leave_game_room', handleLeaveGameRoom);
      gameRoomSocket.off('fetch_state', handleFetchState);
      gameRoomSocket.off('add_player', handleAddPlayer);
      gameRoomSocket.off('add_game', handleAddGame);
      gameRoomSocket.off('remove_game', handleRemoveGame);
      gameRoomSocket.off('add_to_room', handleAddToRoom);
      gameRoomSocket.off('remove_from_room', handleRemoveFromRoom);
      gameRoomSocket.disconnect();
    };
  }, []);

  const value: SocketContextValue = {
    games: gameState.games,
    players: gameState.players,
    currentPlayer: gameState.current_player,
    gameRoomSocket: gameRoomSocket,
    currentGame: gameState.current_player?.current_game,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, useSocket};
