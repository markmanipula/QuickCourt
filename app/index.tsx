// index.tsx
import { View, Text } from "react-native";
import Button from "../components/Button";
import { useRouter } from "expo-router";

export default function HomePage() {
    const router = useRouter();

    return (
        <View>
            <Text>Hello, QuickCourt!</Text>
            <Button
                title="Create Event"
                onPress={() => router.push("/create-event")}
            />
            <Button
                title="View All Events"
                onPress={() => router.push("/events")}
            />
        </View>
    );
}