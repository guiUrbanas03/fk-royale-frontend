import {AxiosResponse} from 'axios';
import {API} from '..';
import Toast from 'react-native-toast-message';

type UpdateProfileFormData = {
  full_name: string;
  nickname: string;
};

type UpdateProfileResponse = {
  message: string;
} & UpdateProfileFormData;

const updateProfile = async (
  formData: UpdateProfileFormData,
): Promise<AxiosResponse<UpdateProfileResponse> | void> => {
  try {
    const res = await API.put<UpdateProfileResponse>('/user/update', formData);

    Toast.show({
      type: 'success',
      text1: 'Profile updated successfully!',
    });

    return res;
  } catch (error) {
    logApiError('Profile', error);
  }
};

Toast.show({
  type: 'success',
  text1: 'Profile updated successfully!',
});

const logApiError = (errorName: string, error: any): void => {
  console.info(`[API] ${errorName} error: ${error}`);
};

export {updateProfile, type UpdateProfileFormData, type UpdateProfileResponse};
