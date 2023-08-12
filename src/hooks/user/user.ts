import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserResource, whoAmI } from "../../api/auth/auth";
import { useAuthInterceptors } from "../auth/interceptors";

const getUser = async () => {
  const res = await whoAmI();
  
  if (res && res.status === 200) {
    return {
      ...res.data.user,
      "profile": res.data.profile,
      "game_stats": res.data.game_stats
    };
  }

  return null;
}

const useUser = () => {
  const updateUser = (user: UserResource) => {
    queryClient.setQueryData(["auth", "whoami"], user);
  }

  const clearUser = () => {
    queryClient.setQueryData(["auth", "whoami"], null);
  }

  const queryClient: QueryClient = useQueryClient();
  useAuthInterceptors(clearUser);

  const { data: user } = useQuery({
    queryKey: ["auth", "whoami"],
    queryFn: () => getUser(),
  });
  
  return { 
    user, updateUser, clearUser
  }

}

export { useUser };