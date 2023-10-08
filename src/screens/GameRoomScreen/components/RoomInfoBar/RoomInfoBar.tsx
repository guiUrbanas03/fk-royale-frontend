import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { LeaveRoomModal } from '../LeaveRoomModal/LeaveRoomModal';
import { Game } from '../../../../models/game';
import { useSocket } from '../../../../contexts/SocketContext/SocketContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

type RoomInfoBarProps = {
    game: Game;
}

const RoomInfoBar = ({ game }: RoomInfoBarProps): JSX.Element => {
    const { getRoom, getPlayer } = useSocket();
    const room = getRoom(game.roomId);
    const owner = getPlayer(room.ownerId);

    return (
        <View style={styles.roomInfo}>
            <View style={{ marginBottom: 20 }}>
                <View style={styles.top}>
                    <Text style={styles.title}>{room.name}</Text>
                    <LeaveRoomModal game={game} />
                </View>
                {room.password ? (
                    <View
                        style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Icon name="lock" />
                        <Text>{room.password}</Text>
                    </View>
                ) : null}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#FFF' }}>
                    {owner.user.profile.nickname}
                </Text>
                <View style={{ flexDirection: 'row', gap: 30 }}>
                    <View
                        style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Icon name="users" color="#FFF" size={16} />
                        <Text style={{ color: '#FFF' }}>
                            {room.playerIds.length}/{game.settings.maxPlayers}
                        </Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Icon name="heart" color="#FFF" size={16} />
                        <Text style={{ color: '#FFF' }}>{game.settings.lives}</Text>
                    </View>
                    <View
                        style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Icon name="clock" color="#FFF" size={16} />
                        <Text style={{ color: '#FFF' }}>
                            {game.settings.turnTimeSeconds}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

type Styles = {
    roomInfo: ViewStyle;
    title: TextStyle;
    top: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
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
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    }
});

export { RoomInfoBar };