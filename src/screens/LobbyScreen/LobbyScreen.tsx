import { Text } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BaseLayout } from "../../components/layout/BaseLayout";
import { Header } from "../../components/Header/Header";
import { socketIo } from "../../socketio";
import { useEffect, useState } from "react";

type LobbyScreenProps = NativeStackScreenProps<RootStackParams, "Lobby">

const LobbyScreen = ({ navigation }: LobbyScreenProps): JSX.Element => {
    const [isConnected, setIsConnected] = useState<boolean>(socketIo.connected);

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
    
        return () => {
          socketIo.off('connect', onConnect);
          socketIo.off('disconnect', onDisconnect);
        };
      }, []);

    return (
        <BaseLayout>
            <Header />
            <Text style={{color: "#FFF"}}>Connected: {String(isConnected)}</Text>
            <Text>Lobby Screen</Text>
        </BaseLayout>
    )
}

export { LobbyScreen };