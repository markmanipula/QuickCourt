import { View, Text, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ViewEvent() {
    const router = useRouter();
    const { title, location, date, time, details } = useLocalSearchParams(); // Get event details from params

    return (
        <View style={{ padding: 20 }}>
            <Button title="Go Back" onPress={() => router.back()} />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>{title}</Text>
            <Text>📍 Location: {location}</Text>
            <Text>📅 Date: {date}</Text>
            <Text>⏰ Time: {time}</Text>
            <Text style={{ marginTop: 10 }}>📝 Details: {details}</Text>
        </View>
    );
}