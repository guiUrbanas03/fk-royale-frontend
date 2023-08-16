import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dimensions, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { BaseLayout } from "../../components/layout/BaseLayout";
import { useState } from "react";
import { Button } from "../../components/Button";
import { Text as PaperText } from "react-native-paper";
import { theme } from "../../themes/default";

type HelpScreenProps = NativeStackScreenProps<RootStackParams, "Help">

const { height } = Dimensions.get("window");

const HelpScreen = ({ navigation }: HelpScreenProps): JSX.Element => {
    const [page, setPage] = useState<number>(0);

    const FirstPage = () => {
        return (
            <>
                <Text style={styles.title}>How to play?</Text>
                <Text style={styles.textBlock}>
                    FK Royale is a game that can be played by 3 to 8 players and it is possible to contain more than one deck of cards. Each player starts with a number of lives determined by the owner of the game.
                    The last player with lives left at the end of all rounds will be victorious.
                </Text>
                <Text style={styles.textBlock}>
                    The player's goal is to guess how many times he can win in a round with the cards he has in hand. If you miss, you lose life.
                    In the first round players will have only one card in hand, in the second round they will have two cards and so on.
                </Text>
            </>
        )

    }

    const SecondPage = () => {
        return (
            <>
                <Text style={styles.title}>Game flow</Text>
                <Text style={styles.textBlock}>
                    A random player will be chosen to start playing, after that, the player to the right of the selected player will follow in sequence and so on.
                    Each round consists of two steps:
                </Text>
                <Text style={styles.textBlock}>
                Guessing step:
                Here, from the player chosen to start, each person must guess how many times they think they win in the round.
                </Text>
                <Text style={styles.textBlock}>
                    Revealing step:
                    After the end of the guessing step, each player will be able to choose which card to play with in the round.
                </Text>
            </>
        )

    }

    const ThirdPage = () => {
        return (
            <>
                <Text style={styles.title}>Suits order</Text>
                <Text style={styles.textBlock}>
                    suits...
                </Text>
                <Text style={styles.title}>Cards order</Text>
                <Text style={styles.textBlock}>
                    cards...
                </Text>
            </>
        )

    }

    const pages = [FirstPage, SecondPage, ThirdPage];

    return (
        <BaseLayout>
            <PaperText style={styles.logo} variant="displaySmall">FK Royale</PaperText>
            <View style={{height: height * 0.8 - 40}}>
                {pages[page]()}
            </View>
            <Text style={{color: "rgba(255, 255, 255, 0.4)", textAlign: "center", marginBottom: 5}}>{page + 1}/{pages.length}</Text>
            <View style={styles.buttonContainer}>
                {
                    page > 0 ? (
                        <Button style={styles.button} mode="outlined" onPress={() => setPage((prev) => prev - 1)} >Previous</Button>
                    ) : null
                }
                {
                    page < pages.length - 1 ? (
                        <Button style={styles.button} mode="contained" onPress={() => setPage((prev) => prev + 1)}>Next</Button>
                    ): null
                }
            </View>
        </BaseLayout>
    );
}

type Styles = {
    logo: TextStyle
    title: TextStyle,
    textBlock: TextStyle;
    buttonContainer: ViewStyle;
    button: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    logo: {
        textAlign: "center", 
        color:  theme.colors.onPrimary,
        marginBottom: 20
    },

    title: {
        fontSize: 18,
        color: "#FFF",
        marginBottom: 20
    },

    textBlock: {
        fontSize: 16,
        color: "#FFF",
        marginBottom: 20
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20
    },

    button: {
        flex: 1
    }
})

export { HelpScreen };