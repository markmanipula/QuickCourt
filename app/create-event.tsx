import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CreateEventScreen() {
    const router = useRouter();
    const [eventName, setEventName] = useState("");
    const [address, setAddress] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = () => {
        if (!eventName || !address || !date || !time) {
            alert("Please fill out all fields.");
            return;
        }

        // TODO: Send event data to backend
        alert(`Event Created:\n\nName: ${eventName}\nAddress: ${address}\nDate: ${date}\nTime: ${time}\nDetails: ${details}`);

        router.back(); // Navigate back to home after creating event
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Create a New Event</Text>

            <TextInput
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
                style={styles.input}
            />
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <TextInput
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                style={styles.input}
            />
            <TextInput
                placeholder="Time (HH:MM AM/PM)"
                value={time}
                onChangeText={setTime}
                style={styles.input}
            />
            <TextInput
                placeholder="Details"
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={4}
                style={[styles.input, { height: 80 }]}
            />

            <Button title="Create Event" onPress={handleSubmit} />
        </View>
    );
}

const styles = {
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
};