import { Text } from "react-native-paper";
import { BaseLayout } from "../../components/layout/BaseLayout";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../navigations/AuthNavigation.tsx/AuthNavigation";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";

type RegisterScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, "Register">,
  NativeStackScreenProps<RootStackParams>
>;

const RegisterScreen = ({ navigation }: RegisterScreenProps): JSX.Element => {
    return (
        <BaseLayout>
            <Text>Register Screen</Text>
        </BaseLayout>
    )
}

export { RegisterScreen };