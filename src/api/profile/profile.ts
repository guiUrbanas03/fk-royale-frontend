import {AxiosResponse} from 'axios';
import {API} from '..';

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

    return res;
  } catch (error) {
    logApiError('Profile', error);
  }
};

const logApiError = (errorName: string, error: any): void => {
  console.info(`[API] ${errorName} error: ${error}`);
};

export {updateProfile, type UpdateProfileFormData, type UpdateProfileResponse};
