import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from "../../navigations/RootNavigation/RootNavigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button as PaperButton } from "react-native-paper";
import { useUser } from "../../hooks/user/user";
import { whoAmI } from "../../api/auth/auth";
import { useAuth } from "../../hooks/auth/auth";

type ProfileScreenProps = NativeStackScreenProps<RootStackParams, 'Profile'>;
const wait = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

const POSTS = [
    {
        id: 0,
        title: "Post 0"
    },
    {
        id: 10,
        title: "Post 10"
    },
    {
        id: 200,
        title: "Post 200"
    },
]

const ProfileScreen = ({ navigation }: ProfileScreenProps): JSX.Element => {
    const queryClient = useQueryClient();
    const { logout } = useAuth();
    const { user } = useUser();

    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: () => wait(1000).then(() => [...POSTS])
    })

    const newPostMutation = useMutation({   
        mutationFn: (title: string) => wait(1000).then(() => POSTS.push({ id: Math.random() * 1234, title: title })),
        onSuccess: () => queryClient.invalidateQueries(["posts"])
    });

    
    if (postsQuery.isLoading) {
        return <View>
            <Text>Loading posts...</Text>
        </View>
    }

    if (postsQuery.isError) {
        return <View>
            <Text>Posts error: {JSON.stringify(postsQuery.error)}</Text>
        </View>
    }

    return (
        <View>
            <Text>Profile Screen</Text>
            <Text>{user?.id}</Text>
            <Text>{user?.email}</Text>
            {
               postsQuery.data.map((post) => (
                <View key={post.id}>
                    <Text>{post.title}</Text>
                </View>
               )) 
            }
            {
                newPostMutation.isLoading ? <Text>Creating post...</Text> : null
            }

            <PaperButton mode="contained" onPress={() => whoAmI()}>
                Who Am I
            </PaperButton>
            <PaperButton disabled={newPostMutation.isLoading} mode="contained" onPress={() => newPostMutation.mutate("New post")}>
                Create new post
            </PaperButton>

            <Button 
                title="Logout"
                onPress={logout}
            />
        </View>
    )
}

export { ProfileScreen };