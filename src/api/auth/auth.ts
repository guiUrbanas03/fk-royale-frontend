import axios, {AxiosResponse} from 'axios';
import {API} from '../index';
import {registerDTO} from '../../dtos/auth';

type LoginUserForm = {
  email: string;
  password: string;
};

type UserResource = {
  id: string;
  email: string;
};

type ProfileResource = {
  id: string;
  user_id: string;
  full_name: string;
  nickname: string;
  avatar_url?: string;
};

type GameStatsResource = {
  id: string;
  profile_id: string;
  level: number;
  matches: number;
  victories: number;
  xp_points: number;
};

type RevokedTokenResource = {
  id: string;
  user_id: string;
  type_: string;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: UserResource;
  profile: ProfileResource;
  game_stats: GameStatsResource;
  message: string;
};

type FullUserResource = {
  id: UserResource['id'];
  email: UserResource['email'];
  profile: ProfileResource;
  game_stats: GameStatsResource;
};

type UserResponse = {
  message: string;
  user: UserResource;
  profile: ProfileResource;
  game_stats: GameStatsResource;
};

type RefreshTokenResponse = {
  message: string;
  access_token: string;
};

type LogoutResponse = {
  message: string;
  revoked_token: RevokedTokenResource;
};

type RegisterFormData = {
  user: {
    email: string;
    password: string;
  };
  profile: {
    fullname: string;
    nickname: string;
  };
};

const register = async (
  formData: RegisterFormData,
): Promise<AxiosResponse<UserResponse> | void> => {
  try {
    const res = await API.post<UserResponse>(
      '/user/create',
      registerDTO(formData),
    );
    return res;
  } catch (error) {
    logApiError('Register', error);
  }
};

const login = async (
  formData: LoginUserForm,
): Promise<AxiosResponse<LoginResponse> | void> => {
  try {
    const res = await API.post<LoginResponse>('/auth/login', formData);
    return res;
  } catch (error) {
    logApiError('Login', error);
  }
};

const whoAmI = async (): Promise<AxiosResponse<UserResponse> | void> => {
  try {
    const res = await API.get<UserResponse>('/auth/who-am-i');
    return res;
  } catch (error) {
    logApiError('WhoAmI', error);

    if (axios.isAxiosError(error)) {
      console.log('error axios: ', error.toJSON());
    }
  }
};

const refreshAccessToken = async (
  refreshToken: string,
): Promise<AxiosResponse<RefreshTokenResponse> | void> => {
  try {
    const res = API.post<RefreshTokenResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    return res;
  } catch (error) {
    logApiError('Refresh Token', error);
  }
};

const logout = async (
  token: string,
): Promise<AxiosResponse<LogoutResponse> | void> => {
  try {
    const res = await API.delete<LogoutResponse>('/auth/logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    logApiError('Logout', error);
  }
};

const logApiError = (errorName: string, error: any): void => {
  console.info(`[API] ${errorName} error: ${error}`);
};

export {
  register,
  login,
  logout,
  refreshAccessToken,
  whoAmI,
  type LoginUserForm,
  type RegisterFormData,
  type UserResource,
  type FullUserResource,
};
