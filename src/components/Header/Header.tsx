import React from 'react';
import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import {useUser} from '../../hooks/user/user';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Header = (): JSX.Element => {
  const {user} = useUser();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row'}}>
        <Text
          variant="labelLarge"
          style={styles.link}
          onPress={() => navigation.navigate('Lobby')}>
          FK Royale
        </Text>
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
        <Icon
          name="user-circle"
          size={24}
          style={{marginLeft: 5}}
          color="#FFF"
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
    marginBottom: 24,
  },
  link: {
    color: 'white',
  },
  profileContainer: {
    flexDirection: 'row',
  },
});

export {Header};
