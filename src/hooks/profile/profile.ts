import {UpdateProfileFormData} from '../../api/profile/profile';
import {useUser} from '../user/user';
import {useUpdateProfileMutation} from './queries';

const useProfile = () => {
  const {user, updateUser} = useUser();
  const updateProfileMutation = useUpdateProfileMutation();

  const update = async (updateData: UpdateProfileFormData) => {
    try {
      const res = await updateProfileMutation.mutateAsync(updateData);

      if (res && user) {
        updateUser({
          ...user,
          game_stats: user?.game_stats,
          profile: {
            ...user.profile,
            nickname: res.data.nickname,
            full_name: res.data.full_name,
          },
        });

        return res;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    update,
  };
};

export {useProfile};
