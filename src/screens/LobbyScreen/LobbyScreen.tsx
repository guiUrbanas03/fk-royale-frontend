import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BaseLayout } from "../../components/layout/BaseLayout";
import { Header } from "../../components/Header/Header";
import { gameRoomSocket, socketIo } from "../../socketio";
import { useEffect, useState } from "react";
import { TextInput, Portal, Modal } from "react-native-paper";
import { Button } from "../../components/Button";
import Icon  from "react-native-vector-icons/FontAwesome5";
import { GameRoom, GameRoomSettings } from "../../models/game-room";
import { useUser } from "../../hooks/user/user";
import { ZodType, z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


type LobbyScreenProps = NativeStackScreenProps<RootStackParams, "Lobby">


export type CreateRoomForm = {
    player_id: GameRoom['player_id'];
    name: GameRoom['name']
    password?: GameRoom['password'];
    max_players: number;
    hearts: number;
    turn_time_seconds: number;
}

const createRoomSchema: ZodType<CreateRoomForm> = z.object({
    player_id: z.string().min(1).max(999),
    name: z.string().min(1).max(20),
    password: z.coerce.string().min(3).max(99).optional(),
    max_players: z.coerce.number().int().min(3).max(8),
    hearts: z.coerce.number().int().min(1).max(10), 
    turn_time_seconds: z.coerce.number().int().min(10).max(120)
});

const LobbyScreen = ({ navigation }: LobbyScreenProps): JSX.Element => {
    const [isConnected, setIsConnected] = useState<boolean>(socketIo.connected);
    const [visible, setVisible] = useState(false);
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const { user } = useUser();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateRoomForm>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            player_id: user?.id
        }
    })

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        function onConnect() {
            console.log("socket connected");
            socketIo.emit("message", "I'm connected!")
            setIsConnected(true);
        }
    
        function onDisconnect() {
            console.log("socket disconnected");
            setIsConnected(false);
        }
    
        socketIo.on('connect', onConnect);
        socketIo.on('disconnect', onDisconnect);
        gameRoomSocket.on("connect", () => console.log("connected to game-room"));
        gameRoomSocket.on("disconnect", () => console.log("connected to game-room"));

        gameRoomSocket.on("create_game_room", (data) => {
            const gameRoom: GameRoom = new GameRoom(data.id, data.player_id, data.name, new GameRoomSettings(data.settings.max_players, data.settings.hearts, data.settings.turn_time_seconds), data.password)
            setRooms((prev) => [...prev, gameRoom]);
        })
    
        return () => {
          socketIo.off('connect', onConnect);
          socketIo.off('disconnect', onDisconnect);
          gameRoomSocket.off('connect')
          gameRoomSocket.off('disconnect')
        };
      }, []);

      const createRoom = (data: CreateRoomForm) => {
        if (user) {
            gameRoomSocket.emit("create_game_room", data);
        }
        reset();
        setVisible(false);
      }

    return (
        <BaseLayout>
            <Header />
            <Text style={{color: isConnected ? "#5AE381" : "#EE597C", fontSize: 12}}>Connected: {String(isConnected)}</Text>
            
            <View style={styles.roomInputs}>
                <TextInput 
                    mode="outlined" 
                    outlineColor="#56947A" 
                    textColor="#FFF"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)" 
                    placeholder="Search for room or player"
                    
                    style={styles.input}  
                />
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.createRoomModal}>
                        <Text style={{color: "#FFF", marginBottom: 20, fontWeight: "700", fontSize: 18}}>Create new room</Text>
                        <View style={{marginBottom: 10}}>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, onBlur, value}}) =>
                                    <TextInput
                                        mode="outlined" 
                                        label="Room name *"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                    />
                                }
                            />
                            { errors.name && <Text style={{ color: "#FFF"}}>{errors.name.message}</Text>}
                        </View>

                        <View style={{marginBottom: 10}}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value}}) =>
                                    <TextInput
                                        mode="outlined" 
                                        label="Room password (optional)"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                    />
                                }
                            />
                            { errors.password && <Text style={{ color: "#FFF"}}>{errors.password.message}</Text>}
                        </View>
                        
                        <View style={{marginBottom: 10}}>
                            <Controller
                                control={control}
                                name="max_players"
                                render={({ field: { onChange, onBlur, value}}) =>
                                    <TextInput
                                        mode="outlined" 
                                        label="Max number of players"
                                        keyboardType="number-pad"
                                        inputMode="numeric"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value?.toString()}
                                    />
                                }
                            />
                            { errors.max_players && <Text style={{ color: "#FFF"}}>{errors.max_players.message}</Text>}
                        </View>
                        
                        <View style={{marginBottom: 10}}>
                            <Controller
                                control={control}
                                name="hearts"
                                render={({ field: { onChange, onBlur, value}}) =>
                                    <TextInput
                                        mode="outlined" 
                                        label="Number of lives"
                                        keyboardType="number-pad"
                                        inputMode="numeric"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value?.toString()}
                                    />
                                }
                            />
                            { errors.hearts && <Text style={{ color: "#FFF"}}>{errors.hearts.message}</Text>}
                        </View>
                        
                        <View style={{marginBottom: 20}}>
                            <Controller
                                control={control}
                                name="turn_time_seconds"
                                render={({ field: { onChange, onBlur, value}}) =>
                                    <TextInput
                                        mode="outlined" 
                                        label="Time per round (seconds)"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="number-pad"
                                        inputMode="numeric"
                                        value={value?.toString()}
                                    />
                                }
                            />
                            { errors.turn_time_seconds && <Text style={{ color: "#FFF"}}>{errors.turn_time_seconds.message}</Text>}
                        </View>

                        <Button mode="contained" buttonColor="#FFF" textColor="#56947A" onPress={handleSubmit(createRoom)}>Create room</Button>
                    </Modal>
                </Portal>
                <Button mode="contained" style={{justifyContent: "center", flex: 0}} onPress={showModal}>
                    <Icon name="plus" size={20} />
                </Button>
            </View>
            {
                rooms.length > 0 ? (
                    <View>
                        {rooms.map((room: GameRoom) => (
                            <View key={room.id} style={{backgroundColor: "#4D8B71", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 20}}>
                                <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                        <Text style={{color: "#FFF", fontWeight: "700", fontSize: 20}}> {room.name}</Text>
                                        {room.password ? <Icon name="lock" /> : null}
                                    </View>
                                    <Text style={{color: "#FFF"}}>{room.player_id.substring(0, 5)}</Text>
                                </View>
                                <View style={{flexDirection: "row", gap: 30}}>
                                    <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                                        <Icon name="users" color="#FFF" />
                                        <Text style={{color: "#FFF"}}>{room.settings.max_players}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                                        <Icon name="heart" color="#FFF" />
                                        <Text style={{color: "#FFF"}}>{room.settings.hearts}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                                        <Icon name="clock" color="#FFF" />
                                        <Text style={{color: "#FFF"}}>{room.settings.turn_time_seconds}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                        <View>
                            <Text style={{color: "rgba(255, 255, 255, 0.5)", fontSize: 24, textAlign: "center"}}>No rooms available :(</Text>
                            <Text style={{color: "rgba(255, 255, 255, 0.5)", fontSize: 20, textAlign: "center", fontWeight: "600"}}>Be the first one to create a room! :D</Text>
                        </View>
                )
            }
        </BaseLayout>
    )
}

type Styles = {
    roomInputs: ViewStyle,
    input: ViewStyle,
    createRoomModal: ViewStyle
}

const styles = StyleSheet.create<Styles>({
    roomInputs: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 30
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        flex: 1,
    },
    createRoomModal: {
        backgroundColor: '#56947A', 
        padding: 20,
        margin: 20,
        borderRadius: 10
    }
})

export { LobbyScreen };