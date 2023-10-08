import React from 'react'
import { BaseLayout } from '../../../../components/layout/BaseLayout';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '../../../../components/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../../../navigations/RootNavigation/RootNavigation';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../../../components/Header/Header';

const NonExistentRoom = () => {
    const navigation: NativeStackNavigationProp<RootStackParams> = useNavigation();

    return (
        <BaseLayout>
            <Header />
            <View>
                <Text style={{ color: '#FFF', fontSize: 20, marginBottom: 10 }}>
                    Ops...
                </Text>
                <Text style={{ color: '#FFF', fontSize: 16, marginBottom: 20 }}>
                    This room no longer exists.
                </Text>
                <Button
                    mode="contained"
                    style={{ padding: 4 }}
                    buttonColor="#FFF"
                    textColor="#56947A"
                    onPress={() => navigation.navigate('Lobby')}>
                    GO TO LOBBY
                </Button>
            </View>
        </BaseLayout>
    )
}

export { NonExistentRoom };