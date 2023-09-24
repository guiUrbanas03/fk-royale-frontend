import React from 'react';
import {Image, Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import {useUser} from '../../hooks/user/user';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSocket} from '../../contexts/SocketContext/SocketContext';

const Header = (): JSX.Element => {
  const {user} = useUser();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {logState} = useSocket();

  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row'}}>
        <Text
          variant="labelLarge"
          style={styles.link}
          onPress={() => navigation.navigate('Lobby')}>
          FK Royale
        </Text>
        <Pressable onPress={logState}>
          <Text style={{color: 'white'}}>State</Text>
        </Pressable>
        <Pressable
          style={{marginLeft: 8}}
          onPress={() => navigation.navigate('Help')}>
          <Icon name="question-circle" size={20} color="#70B99B" />
        </Pressable>
      </View>

      <Pressable
        style={styles.profileContainer}
        onPress={() => navigation.navigate('Profile')}>
        <Text variant="labelLarge" style={{...styles.link, textAlign: 'right'}}>
          {user?.profile.nickname}{' '}
        </Text>
        <Image
          style={{
            width: 30,
            height: 30,
            borderRadius: 30,
            borderWidth: 3,
            borderColor: '#56947A',
          }}
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

type Styles = {
  header: ViewStyle;
  link: ViewStyle;
  profileContainer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  link: {
    color: 'white',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export {Header};
