import {QueryClient, useQuery, useQueryClient} from '@tanstack/react-query';
import {FullUserResource, whoAmI} from '../../api/auth/auth';
import {useAuthInterceptors} from '../auth/interceptors';

const getUser = async () => {
  const res = await whoAmI();

  if (res && res.status === 200) {
    return {
      ...res.data.user,
      profile: res.data.profile,
      game_stats: res.data.game_stats,
    };
  }

  return null;
};

const useUser = () => {
  const updateUser = (user: FullUserResource) => {
    queryClient.setQueryData(['auth', 'whoami'], user);
  };

  const clearUser = () => {
    queryClient.setQueryData(['auth', 'whoami'], null);
  };

  const queryClient: QueryClient = useQueryClient();
  useAuthInterceptors(clearUser);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth', 'whoami'],
    queryFn: () => getUser(),
  });

  return {
    user,
    updateUser,
    clearUser,
    isLoading,
    isError,
  };
};

export {useUser};
