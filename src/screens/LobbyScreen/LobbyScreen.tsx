import { Text } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BaseLayout } from "../../components/layout/BaseLayout";
import { Header } from "../../components/Header/Header";

type LobbyScreenProps = NativeStackScreenProps<RootStackParams, "Lobby">

const LobbyScreen = ({ navigation }: LobbyScreenProps): JSX.Element => {
    return (
        <BaseLayout>
            <Header />
            <Text>Lobby Screen</Text>
        </BaseLayout>
    )
}

export { LobbyScreen };