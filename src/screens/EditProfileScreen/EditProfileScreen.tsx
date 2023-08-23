import React from 'react';
import {Pressable, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {IconButton, Text, TextInput} from 'react-native-paper';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/Button';
import {UpdateProfileFormData} from '../../api/profile/profile';
import {zodResolver} from '@hookform/resolvers/zod';
import {ZodType, z} from 'zod';
import {useProfile} from '../../hooks/profile/profile';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {useUser} from '../../hooks/user/user';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParams,
  'EditProfile'
>;

const updateProfileSchema: ZodType<UpdateProfileFormData> = z.object({
  nickname: z.string(),
  full_name: z.string(),
});

const EditProfileScreen = ({navigation}: ProfileScreenProps) => {
  const {user} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nickname: user?.profile.nickname,
      full_name: user?.profile.full_name,
    },
  });

  const {update} = useProfile();

  const submitProfileForm = async (data: UpdateProfileFormData) => {
    const res = await update(data);

    if (res?.status === 200) {
      Toast.show({
        type: 'success',
        text1: res.data.message,
      });
      navigation.navigate('Profile');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
      reset();
    }
  };
  return (
    <BaseLayout>
      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Icon name="arrow-left" color="#fff" size={16} />
        </Pressable>
        <Text style={styles.title}>Edit profile</Text>
      </View>
      <View style={styles.input}>
        <Controller
          control={control}
          name="nickname"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              mode="outlined"
              label="Nickname"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.nickname && (
          <Text style={styles.error}>{errors.nickname.message}</Text>
        )}
      </View>

      <View style={styles.input}>
        <Controller
          name="full_name"
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              mode="outlined"
              label="Full name"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.full_name && (
          <Text style={styles.error}>{errors.full_name.message}</Text>
        )}
      </View>

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(submitProfileForm)}>
        Update profile
      </Button>
    </BaseLayout>
  );
};

type Styles = {
  title: TextStyle;
  input: ViewStyle;
  button: ViewStyle;
  actions: ViewStyle;
  action: ViewStyle;
  error: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  title: {
    fontSize: 20,
    color: '#FFF',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    padding: 4,
    marginBottom: 40,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    flex: 1,
    padding: 2,
  },
  error: {
    marginTop: 4,
    color: '#FFF',
  },
});

export {EditProfileScreen};
