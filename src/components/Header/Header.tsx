import { StyleSheet, View, ViewStyle } from "react-native";
import { useUser } from "../../hooks/user/user";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { Text } from "react-native-paper";

const Header = (): JSX.Element => {
    const { user } = useUser();
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
        <View style={styles.header}>
            <Text variant="labelLarge" style={styles.link} onPress={() => navigation.navigate("Lobby")}>FK Royale</Text>
            <Text variant="labelLarge" style={{...styles.link, textAlign: 'right'}} onPress={() => navigation.navigate("Profile")}>{user?.email}</Text>
        </View>
    )
}

type Styles = {
    header: ViewStyle,
    link: ViewStyle
} 

const styles = StyleSheet.create<Styles>({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    link: {
        flex: 1,
        color: "white"
    }
});


export { Header };