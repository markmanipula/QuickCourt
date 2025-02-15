import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CreateEventScreen() {
    const [eventName, setEventName] = useState("");
    const router = useRouter();

    return (
        <View>
            <Text>Create a New Event</Text>
            <TextInput
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />
            <Button title="Submit" onPress={() => {
                alert(`Event Created: ${eventName}`);
                router.back(); // Navigate back to home
            }} />
        </View>
    );
}