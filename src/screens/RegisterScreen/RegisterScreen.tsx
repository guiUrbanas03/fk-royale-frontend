import React from 'react';
import {Text, TextInput} from 'react-native-paper';
import {BaseLayout} from '../../components/layout/BaseLayout';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParams} from '../../navigations/AuthNavigation.tsx/AuthNavigation';
import {RootStackParams} from '../../navigations/RootNavigation/RootNavigation';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {theme} from '../../themes/default';
import {Button} from '../../components/Button';
import {ZodType, z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {RegisterFormData} from '../../api/auth/auth';
import {useAuth} from '../../hooks/auth/auth';

type RegisterScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, 'Register'>,
  NativeStackScreenProps<RootStackParams>
>;

const registerSchema: ZodType<RegisterFormData> = z.object({
  user: z.object({
    email: z.string().email().min(1).max(300),
    password: z.string().min(6).max(300),
  }),
  profile: z.object({
    fullname: z.string().min(1).max(300),
    nickname: z.string().min(1).max(20),
  }),
});

const RegisterScreen = ({}: RegisterScreenProps): JSX.Element => {
  const {register} = useAuth();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const submitRegisterForm = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <BaseLayout>
      <Text style={styles.title} variant="bodyMedium">
        Register
      </Text>
      <View style={styles.input}>
        <Controller
          control={control}
          name="profile.fullname"
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
        {errors.profile?.fullname && (
          <Text style={styles.error}>{errors.profile.fullname.message}</Text>
        )}
      </View>

      <View style={styles.input}>
        <Controller
          control={control}
          name="profile.nickname"
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
        {errors.profile?.nickname && (
          <Text style={styles.error}>{errors.profile.nickname.message}</Text>
        )}
      </View>

      <View style={styles.input}>
        <Controller
          control={control}
          name="user.email"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              mode="outlined"
              label="Email"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.user?.email && (
          <Text style={styles.error}>{errors.user.email.message}</Text>
        )}
      </View>

      <View style={styles.input}>
        <Controller
          control={control}
          name="user.password"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              mode="outlined"
              label="Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        {errors.user?.password && (
          <Text style={styles.error}>{errors.user.password.message}</Text>
        )}
      </View>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(submitRegisterForm)}>
        Register
      </Button>
    </BaseLayout>
  );
};

type Styles = {
  title: TextStyle;
  input: ViewStyle;
  button: ViewStyle;
  error: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  title: {
    color: theme.colors.white,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    padding: 4,
  },
  error: {
    marginTop: 4,
    color: theme.colors.onError,
  },
});

export {RegisterScreen};
