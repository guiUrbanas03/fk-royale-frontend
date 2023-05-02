import { SafeAreaView, ScrollView, View, Text, Button } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button as PaperButton } from "react-native-paper";
import { useAuth } from "../../hooks/auth/auth";
import { CompositeScreenProps } from "@react-navigation/native";
import { AuthStackParams } from "../../navigations/AuthNavigation.tsx/AuthNavigation";

type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, "Login">,
  NativeStackScreenProps<RootStackParams>
>;

const LoginScreen = ({ navigation }: LoginScreenProps): JSX.Element => {
    const { login } = useAuth();

    return (
    <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text>Login Screen</Text>
            <PaperButton mode="contained" onPress={login}>
              Login
            </PaperButton>
            <Button 
              title="Profile"
              onPress={() => navigation.navigate("Help")}
            />
            <Button 
              title="Lobby"
              onPress={() => navigation.navigate("Lobby")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export { LoginScreen }