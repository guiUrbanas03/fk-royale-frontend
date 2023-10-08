import React, { useState } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Player } from '../../../../models/player';
import { useUser } from '../../../../hooks/user/user';
import { Modal, Portal, Text } from 'react-native-paper';
import { useSocket } from '../../../../contexts/SocketContext/SocketContext';
import { Game } from '../../../../models/game';

type PlayerItemProps = {
    player: Player;
    game: Game;
};

const PlayerItem = ({ player, game }: PlayerItemProps) => {
    const { getRoom } = useSocket();
    const { user } = useUser();
    const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);

    const room = getRoom(game.roomId);
    const isCurrentPlayer = player.user.id === user?.id;

    return (
        <>
            <Pressable
                onPress={() => setShowPlayerModal(true)}
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
            </Pressable>
            <Portal>
                <Modal
                    style={{top: 0}}
                    visible={showPlayerModal}
                    onDismiss={() => setShowPlayerModal(false)}
                    contentContainerStyle={styles.modal}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.modalAvatar}
                            resizeMode="contain"
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                            }}
                        />
                    </View>
                    <View style={styles.modalBody}>
                        <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "700", textAlign: "center" }}>{player.user.profile.nickname}</Text>
                        <Text style={{ fontSize: 20, color: "#2A343B", fontWeight: "700", textAlign: "center" }}>{player.user.profile.full_name}</Text>
                    </View>
                    <View style={styles.modalLowerBody}>
                        <View style={styles.levelContainer}>
                            <Text style={styles.level}>Level: {player.user.game_stats.level}</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "500", marginBottom: 10 }}>Matches: {player.user.game_stats.matches}</Text>
                        <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "500" }}>Victories: {player.user.game_stats.victories}</Text>

                    </View>
                </Modal>
            </Portal>
        </>
    );
};

type Styles = {
    container: ViewStyle;
    status: ViewStyle;
    avatar: ImageStyle;
    modal: ViewStyle;
    modalAvatar: ImageStyle;
    avatarContainer: ViewStyle;
    modalBody: ViewStyle;
    modalLowerBody: ViewStyle;
    levelContainer: ViewStyle;
    level: TextStyle;
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
    modal: {
        overflow: 'hidden',
        backgroundColor: '#56947A',
        margin: 20,
        borderRadius: 10,
    },

    avatarContainer: {
        backgroundColor: "#35604E",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        paddingBottom: 0,
    },
    modalAvatar: {
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#4D8B71',
        position: "relative",
        top: 30
    },
    modalBody: {
        backgroundColor: "transparent",
        padding: 20,
        paddingTop: 30,
    },
    modalLowerBody: {
        backgroundColor: "transparent",
        marginHorizontal: 20,
        marginBottom: 10,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)"
    },
    levelContainer: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#4B8870',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        marginBottom: 12,
      },
    
      level: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
      },
});

export { PlayerItem };
