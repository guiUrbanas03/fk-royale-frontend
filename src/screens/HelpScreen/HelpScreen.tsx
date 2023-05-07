import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { BaseLayout } from "../../components/layout/BaseLayout";

type HelpScreenProps = NativeStackScreenProps<RootStackParams, "Help">


const HelpScreen = ({ navigation }: HelpScreenProps): JSX.Element => {

    return (
        <BaseLayout>
            <Text>Help Screen</Text>
        </BaseLayout>
    );
}

export { HelpScreen };