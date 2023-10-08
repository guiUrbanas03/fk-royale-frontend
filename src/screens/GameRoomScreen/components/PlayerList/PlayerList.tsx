import React from 'react'
import { FlatList, ListRenderItem } from 'react-native';
import { Player } from '../../../../models/player';
import { PlayerItem } from '../PlayerItem/PlayerItem';
import { Game } from '../../../../models/game';

type PlayerListProps = {
    data: ArrayLike<Player>;
    game: Game;
}

const PlayerList = ({ data, game }: PlayerListProps): JSX.Element => {
    const renderPlayerItem: ListRenderItem<Player> = ({ item: player }) => (
        <PlayerItem player={player} game={game} />
    );

    return (
        <FlatList
            scrollEnabled
            data={data}
            renderItem={renderPlayerItem}
            keyExtractor={(player: Player) => player.socketId}
        />
    );
}

export { PlayerList };