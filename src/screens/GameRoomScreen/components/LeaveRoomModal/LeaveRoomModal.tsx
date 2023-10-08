import React, { useEffect, useRef, useState } from 'react'
import { Modal, Portal, Text } from 'react-native-paper';
import { Button } from '../../../../components/Button';
import { Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useSocket } from '../../../../contexts/SocketContext/SocketContext';
import { Game } from '../../../../models/game';
import { EventArg, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../../../navigations/RootNavigation/RootNavigation';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type LeaveRoomModalProps = {
    game: Game;
}

type EventData = {
    action: Readonly<{
        type: string;
        payload?: object | undefined;
        source?: string | undefined;
        target?: string | undefined;
    }>;
};


const LeaveRoomModal = ({ game }: LeaveRoomModalProps): JSX.Element => {
    const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
    const { socketIO, getRoom } = useSocket();
    const navigation: NativeStackNavigationProp<RootStackParams> = useNavigation();
    const exitEvent = useRef<EventArg<'beforeRemove', true, EventData>>();

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', event => {
            event.preventDefault();

            if (event.data.action.type !== 'GO_BACK') {
                navigation.dispatch(event.data.action);
            } else {
                exitEvent.current = event;
                setShowLeaveModal(true);
            }
        });

        return unsubscribe;
    }, [navigation]);

    const room = getRoom(game.roomId);

    const onLeaveRoom = () => {
        socketIO.emit('leave_game_room', { game_id: game.id });
        confirmLeaveRoom();
    };

    const confirmLeaveRoom = () => {
        if (exitEvent.current) {
            navigation.dispatch(exitEvent.current.data.action);
        }
    };

    return (
        <>
            <Pressable style={styles.pressable} onPress={() => setShowLeaveModal(true)}>
                <MaterialIcon
                    size={24}
                    color="#FFF"
                    name="exit-run"
                    style={{ transform: [{ scaleX: -1 }] }}
                />
            </Pressable>
            <Portal>
                <Modal
                    visible={showLeaveModal}
                    onDismiss={() => setShowLeaveModal(false)}
                    contentContainerStyle={styles.leaveRoomModal}>
                    <Text style={styles.actionText}>LEAVE ROOM</Text>
                    <Text style={{ color: '#FFF', marginBottom: 20, fontSize: 18 }}>
                        Are you sure you want to leave the room{' '}
                        <Text style={{ fontWeight: '700', color: '#FFF', fontSize: 18 }}>
                            {room.name}
                        </Text>
                        ?
                    </Text>
                    <Button
                        mode="contained"
                        style={{ padding: 4 }}
                        buttonColor="#FFF"
                        textColor="#56947A"
                        onPress={onLeaveRoom}>
                        LEAVE ROOM
                    </Button>
                </Modal>
            </Portal>
        </>
    )
}

type Styles = {
    leaveRoomModal: ViewStyle;
    actionText: TextStyle;
    pressable: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
    leaveRoomModal: {
        backgroundColor: '#56947A',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    actionText: {
        color: '#FFF',
        marginBottom: 20,
        fontWeight: '700',
        fontSize: 18,
    },
    pressable: {
        backgroundColor: '#4D8B71',
        padding: 10,
        borderRadius: 4,
    }
});

export { LeaveRoomModal };