import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, TextInput } from "react-native-paper";
import { useAuth } from "../../hooks/auth/auth";
import { CompositeScreenProps } from "@react-navigation/native";
import { AuthStackParams } from "../../navigations/AuthNavigation.tsx/AuthNavigation";
import { BaseLayout } from "../../components/layout/BaseLayout";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { theme } from "../../themes/default";
import { Button } from "../../components/Button";
import { useForm, Controller } from "react-hook-form";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParams, "Login">,
  NativeStackScreenProps<RootStackParams>
>;

type LoginFormData = {
  email: string,
  password: string
}

const loginSchema: ZodType<LoginFormData> = z.object({
  email: z.string().email().min(1).max(300),
  password: z.string().min(6).max(300)
});

const LoginScreen = ({ navigation }: LoginScreenProps): JSX.Element => {
    const { login } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
    });

    const submitLoginForm = (data: LoginFormData) => {
      login(data.email, data.password);
    }

    return (
      <BaseLayout>
          <Text style={styles.title} variant="displaySmall">FK Royale</Text>
          <View style={styles.input}>
            <Controller 
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value}}) =>
                <TextInput 
                  mode="outlined" 
                  label="Email"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
              />
              }
            />
          { errors.email && <Text style={styles.error}>{errors.email.message}</Text> }
          </View>
          
          <View style={styles.input}>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value} }) => 
                <TextInput  
                  mode="outlined" 
                  label="Password" 
                  secureTextEntry 
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              }
            />
          { errors.password && <Text style={styles.error}>{errors.password.message}</Text> }
          </View>
            
          <Button style={styles.button} mode="contained" onPress={handleSubmit(submitLoginForm)}>Login</Button>

          <View style={styles.actions}>
            <Button 
              style={styles.action} 
              mode="contained" 
              onPress={() => navigation.navigate("Register")}
            >
              Register
            </Button>
            <Button 
              style={styles.action} 
              mode="contained" 
              onPress={() => navigation.navigate("Help")}
              >
                How to play?
              </Button>
          </View>
      </BaseLayout>
    )
}

type Styles = {
  title: TextStyle,
  input: ViewStyle,
  button: ViewStyle,
  actions: ViewStyle,
  action: ViewStyle,
  error: TextStyle
}

const styles = StyleSheet.create<Styles>({
  title: {
    textAlign: "center", 
    color:  theme.colors.onPrimary,
    marginBottom: 20
  },
  input: {
    marginBottom: 20
  },
  button: {
    padding: 4,
    marginBottom: 40
  },
  actions: {
    flexDirection: "row",
    gap: 12
  },
  action: {
    flex: 1,
    padding: 2
  },
  error: {
    marginTop: 4,
    color: theme.colors.onError
  }
});

export { LoginScreen }