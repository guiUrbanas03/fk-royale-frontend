import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { Player } from '../../../../models/player';
import { useUser } from '../../../../hooks/user/user';
import { Text } from 'react-native-paper';
import { useSocket } from '../../../../contexts/SocketContext/SocketContext';
import { Game } from '../../../../models/game';

type PlayerItemProps = {
    player: Player;
    game: Game;
};

const PlayerItem = ({ player, game }: PlayerItemProps) => {
    const { getRoom } = useSocket();
    const { user } = useUser();

    const room = getRoom(game.roomId);
    const isCurrentPlayer = player.user.id === user?.id;

    return (
        <View
            key={player.socketId}
            style={{
                ...styles.container,
                borderWidth: isCurrentPlayer ? 1 : 0,
                borderColor: isCurrentPlayer ? '#FFD362' : ''
            }}
        >
            <Image
                style={styles.avatar}
                resizeMode="contain"
                source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
            />
            <View style={styles.status}>
                <Text style={{ color: '#FFF' }}>{player?.user.email}</Text>
                {room.ownerId === player.socketId ? (
                    <Text style={{ color: '#FFF', fontWeight: '700' }}>OWNER</Text>
                ) : (
                    <Text style={{ color: '#FFD362', fontWeight: '700' }}>WAITING</Text>
                )}
            </View>
        </View>
    );
};

type Styles = {
    container: ViewStyle;
    status: ViewStyle;
    avatar: ImageStyle;
};

const styles = StyleSheet.create<Styles>({
    container: {
        backgroundColor: '#4D8B71',
        borderRadius: 10,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 10,
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#56947A',
    },
});

export { PlayerItem };
