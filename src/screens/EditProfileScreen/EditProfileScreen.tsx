import React from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/Button';
import {UpdateProfileFormData} from '../../api/profile/profile';
import {zodResolver} from '@hookform/resolvers/zod';
import {ZodType, z} from 'zod';
import {useProfile} from '../../hooks/profile/profile';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {useUser} from '../../hooks/user/user';

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
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nickname: user?.profile.nickname,
      full_name: user?.profile.full_name,
    },
  });

  const {update} = useProfile();

  const submitProfileForm = (data: UpdateProfileFormData) => {
    update(data);
    navigation.navigate('Profile');
  };
  return (
    <BaseLayout>
      <Text style={styles.title}>Edit profile</Text>
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
    marginBottom: 20,
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
