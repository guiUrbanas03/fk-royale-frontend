import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  Dimensions,
  TextStyle,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {Button} from '../../components/Button';
import {useUser} from '../../hooks/user/user';
import {useAuth} from '../../hooks/auth/auth';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {Header} from '../../components/Header/Header';

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParams,
  'Profile'
>;

const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation}: ProfileScreenProps): JSX.Element => {
  const {logout} = useAuth();
  const {user, isLoading, isError} = useUser();

  if (isLoading) {
    return (
      <View>
        <Text>Loading user...</Text>
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View>
        <Text>Error loading user!</Text>
      </View>
    );
  }

  const defeats = user.game_stats.matches - user.game_stats.victories;
  const victoriesPercentage =
    user.game_stats.victories > 0
      ? (
          (user.game_stats.victories / user.game_stats.matches) *
          100
        ).toPrecision(2)
      : 0;
  const defeatsPercentage =
    defeats > 0
      ? ((defeats / user.game_stats.matches) * 100).toPrecision(2)
      : 0;

  return (
    <BaseLayout>
      <Header />

      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.nickname}>{user.profile.nickname}</Text>
      <Text style={styles.fullName}>{user.profile.full_name}</Text>

      <View style={styles.levelContainer}>
        <Text style={styles.level}>Level: {user.game_stats.level}</Text>
      </View>

      <View style={styles.outerLevelBar}>
        <View
          style={{
            ...styles.innerLevelBar,
            width: user.game_stats.xp_points,
          }}
        />
      </View>
      <Text style={styles.xpPoints}>{user.game_stats.xp_points}</Text>

      <View style={styles.statContainer}>
        <Text style={styles.statTitle}>Matches</Text>
        <Text style={styles.statValue}>{user.game_stats.matches}</Text>
      </View>

      <View style={styles.statContainer}>
        <Text style={styles.statTitle}>
          Victories{' '}
          <Text style={styles.statTitleInfo}>({victoriesPercentage}%)</Text>
        </Text>
        <Text style={{...styles.statValue, color: '#5AE381'}}>
          {user.game_stats.victories}
        </Text>
      </View>

      <View style={{...styles.statContainer, borderBottomWidth: 0}}>
        <Text style={styles.statTitle}>
          Defeats{' '}
          <Text style={styles.statTitleInfo}>({defeatsPercentage}%)</Text>
        </Text>
        <Text style={{...styles.statValue, color: '#EE597C'}}>{defeats}</Text>
      </View>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('EditProfile')}
        style={{marginBottom: 20}}>
        Edit profile
      </Button>

      <Button mode="outlined" onPress={logout} style={{marginBottom: 60}}>
        Logout
      </Button>
    </BaseLayout>
  );
};

type Styles = {
  imageContainer: ViewStyle;
  image: ImageStyle;
  nickname: TextStyle;
  fullName: TextStyle;
  levelContainer: ViewStyle;
  level: TextStyle;
  outerLevelBar: ViewStyle;
  innerLevelBar: ViewStyle;
  xpPoints: TextStyle;
  statContainer: ViewStyle;
  statTitle: TextStyle;
  statTitleInfo: TextStyle;
  statValue: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
  },

  image: {
    flex: 1,
    width: width * 0.4,
    maxWidth: '100%',
    height: width * 0.4,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#56947A',
  },

  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },

  fullName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5DA287',
    textAlign: 'center',
    marginBottom: 20,
  },

  levelContainer: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4B8870',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 12,
  },

  level: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  outerLevelBar: {
    borderWidth: 2,
    borderColor: '#FFF',
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(46, 67, 67, 1)',
    position: 'relative',
  },

  innerLevelBar: {
    backgroundColor: 'rgba(77, 139, 113, 1)',
    height: 36,
    borderRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  xpPoints: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    textAlign: 'center',
    transform: [{translateY: -30}],
    marginBottom: 10,
  },
  statContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 20,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  statTitleInfo: {
    fontSize: 14,
    color: '#5DA287',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFF',
  },
});

export {ProfileScreen};
