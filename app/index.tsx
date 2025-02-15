import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";  // Import useRouter

export default function HomeScreen() {
    const router = useRouter();  // Initialize router

    return (
        <View>
            <Text>Hello, QuickCourt!</Text>
            <Button title="Create event" onPress={() => router.push("/create-event")} />
            <Button title="View existing events" onPress={() => alert("Viewing events...")} />
        </View>
    );
}