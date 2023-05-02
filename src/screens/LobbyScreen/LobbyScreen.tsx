import { View, Text } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type LobbyScreenProps = NativeStackScreenProps<RootStackParams, "Lobby">

const LobbyScreen = ({ navigation }: LobbyScreenProps): JSX.Element => {
    return <View>
        <Text>Lobby Screen</Text>
    </View>
}

export { LobbyScreen };