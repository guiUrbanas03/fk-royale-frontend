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
  socketIO: typeof socketIO;
  currentGame?: Game;
  currentPlayer?: Player;
  logState: () => void;
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
  });

  const currentPlayer = gameState.players[socketIO.id];
  const currentGame = currentPlayer?.current_game;

  const logState = () => {
    console.log(
      '---> GAME STATE: ',
      JSON.stringify(
        {
          games: gameState.games ?? 'N/D',
          players: gameState.players ?? 'N/D',
          currentPlayer: currentPlayer ?? 'N/D',
          currentGame: currentGame ?? 'N/D',
        },
        null,
        4,
      ),
    );
  };

  useEffect(() => {
    logState();
  }, [gameState]);

  useEffect(() => {
    const handleConnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${socketIO.id} connected.`);
    };

    const handleDisconnectGameRoom = () => {
      console.log(`[GAME ROOM]: player ${socketIO.id} disconnected.`);
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
      });
    };

    const handleCreateGameRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: player ${socketIO.id} created room ${data.game.room.id}`,
      );

      const room: Room = new Room(data.game.room);
      const settings: GameSettings = new GameSettings(data.game.settings);
      const game = new Game({id: data.game.id, room: room, settings: settings});

      setGameState(prev => ({
        ...prev,
        players: {
          ...prev.players,
          [data.player.socket_id]: Player.buildPlayer(data.player),
        },
      }));

      navigation.navigate('GameRoom', {gameId: game.id});
    };

    const handleJoinGameRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: player ${socketIO.id} joined room ${data.game.room.id}`,
      );

      if (socketIO.id === data.player.socket_id) {
        setGameState(prev => ({
          ...prev,
          players: {
            ...prev.players,
            [data.player.socket_id]: Player.buildPlayer(data.player),
          },
        }));

        navigation.navigate('GameRoom', {gameId: data.game.id});
      }
    };

    const handleLeaveGameRoom = (data: GameAndRoom) => {
      console.log(
        `[GAME ROOM]: player ${data.player.socket_id} left room ${data.game.room.id}.`,
      );

      if (socketIO.id === data.player.socket_id) {
        setGameState(prev => ({
          ...prev,
          players: {
            ...prev.players,
            [data.player.socket_id]: Player.buildPlayer(data.player),
          },
        }));

        navigation.navigate('Lobby');
      }
    };

    const handleAddPlayer = (data: Player) => {
      console.log(
        `[GAME ROOM]: new player ${socketIO.id} connected ${data.socket_id}.`,
      );

      setGameState(prev => ({
        ...prev,
        players: {...prev.players, [data.socket_id]: Player.buildPlayer(data)},
      }));
    };

    const handleAddGame = (data: Game) => {
      console.log(`[GAME ROOM]: new room ${socketIO.id} created ${data.id}.`);

      setGameState(prev => ({
        ...prev,
        games: {...prev.games, [data.id]: Game.buildGame(data)},
      }));
    };

    const handleRemoveGame = (data: Game) => {
      console.log(`[GAME ROOM]: new room ${socketIO.id} removed ${data.id}.`);

      setGameState(prev => {
        const filteredGames: GameObject = {};

        Object.keys(prev.games).forEach(key => {
          const game = prev.games[key];

          if (game.id !== data.id) {
            filteredGames[key] = game;
          }
        });

        console.log(
          '--> CHECK : ',
          JSON.stringify(
            {
              currentPlayer: currentPlayer?.user?.profile?.nickname ?? 'N/D',
              currentGame: currentPlayer?.current_game?.id ?? 'N/D',
              dataId: data.id,
            },
            null,
            4,
          ),
        );
        if (currentPlayer?.current_game?.id === data.id) {
          navigation.navigate('Lobby');
        }

        const updatedPlayers = Object.values(prev.players).reduce(
          (playerObject: PlayerObject, currPlayer: Player) => {
            if (currPlayer?.current_game?.id === data.id) {
              currPlayer.current_game = undefined;
            }

            playerObject[currPlayer.socket_id] = currPlayer;

            return playerObject;
          },
          {},
        );
        return {
          ...prev,
          players: updatedPlayers,
          games: filteredGames,
        };
      });
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

    socketIO.on('connect', handleConnectGameRoom);
    socketIO.on('disconnect', handleDisconnectGameRoom);
    socketIO.on('create_game_room', handleCreateGameRoom);
    socketIO.on('join_game_room', handleJoinGameRoom);
    socketIO.on('leave_game_room', handleLeaveGameRoom);
    socketIO.on('fetch_state', handleFetchState);
    socketIO.on('add_player', handleAddPlayer);
    socketIO.on('add_game', handleAddGame);
    socketIO.on('remove_game', handleRemoveGame);
    socketIO.on('add_to_room', handleAddToRoom);
    socketIO.on('remove_from_room', handleRemoveFromRoom);

    return () => {
      socketIO.off('connect', handleConnectGameRoom);
      socketIO.off('disconnect', handleDisconnectGameRoom);
      socketIO.off('create_game_room', handleCreateGameRoom);
      socketIO.off('join_game_room', handleJoinGameRoom);
      socketIO.off('leave_game_room', handleLeaveGameRoom);
      socketIO.off('fetch_state', handleFetchState);
      socketIO.off('add_player', handleAddPlayer);
      socketIO.off('add_game', handleAddGame);
      socketIO.off('remove_game', handleRemoveGame);
      socketIO.off('add_to_room', handleAddToRoom);
      socketIO.off('remove_from_room', handleRemoveFromRoom);
      socketIO.disconnect();
    };
  }, []);

  const value: SocketContextValue = {
    socketIO: socketIO,
    games: gameState.games,
    players: gameState.players,
    currentPlayer: currentPlayer,
    currentGame: currentGame,
    logState: logState,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, useSocket};
