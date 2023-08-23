import {useMutation} from '@tanstack/react-query';
import {UpdateProfileFormData, updateProfile} from '../../api/profile/profile';

const useUpdateProfileMutation = () => {
  return useMutation({
    mutationKey: ['profile', 'update'],
    mutationFn: (updateData: UpdateProfileFormData) =>
      updateProfile(updateData),
    onError: (error: any) => console.error('Profile error: ', error),
  });
};

export {useUpdateProfileMutation};
