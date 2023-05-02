import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";

type HelpScreenProps = NativeStackScreenProps<RootStackParams, "Help">


const HelpScreen = ({ navigation }: HelpScreenProps): JSX.Element => {

    return (
        <View>
            <Text>Help Screen</Text>
        </View>
    );
}

export { HelpScreen };