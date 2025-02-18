import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CreateEventScreen() {
    const router = useRouter();
    const [eventName, setEventName] = useState("");
    const [address, setAddress] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [members, setMembers] = useState("");
    const [details, setDetails] = useState("");

    // Helper function to format date input as MM/DD/YYYY
    const formatDateInput = (text: string) => {
        // Remove all non-numeric characters
        let cleaned = text.replace(/\D/g, "");

        // Handle deletion by allowing a cleared state
        if (cleaned.length === 0) {
            setDate("");
            return;
        }

        // Limit input to 8 digits (MMDDYYYY)
        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }

        // Apply formatting
        let formattedDate = "";
        if (cleaned.length <= 2) {
            formattedDate = cleaned;
        } else if (cleaned.length <= 4) {
            formattedDate = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        } else {
            formattedDate = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
        }

        setDate(formattedDate);
    };

    const handleSubmit = () => {
        if (!eventName || !address || !date || !time || !members) {
            alert("Please fill out all required fields.");
            return;
        }

        alert(`Event Created:\n\nName: ${eventName}\nAddress: ${address}\nDate: ${date}\nTime: ${time}\nMembers: ${members}\nDetails: ${details || "N/A"}`);

        router.back(); // Navigate back after creating event
    };

    return (
        <View style={styles.container}>
            <Button title="Go Back" onPress={() => router.back()} />

            <Text style={styles.heading}>Create a New Event</Text>

            <Text style={styles.label}>Event Name</Text>
            <TextInput
                placeholder="Enter event name"
                value={eventName}
                onChangeText={setEventName}
                style={styles.input}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                placeholder="Enter address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
                placeholder="MM/DD/YYYY"
                value={date}
                onChangeText={formatDateInput}
                keyboardType="numeric"
                style={styles.input}
                maxLength={10} // Prevents excessive input
            />

            <Text style={styles.label}>Time</Text>
            <TextInput
                placeholder="HH:MM AM/PM"
                value={time}
                onChangeText={setTime}
                style={styles.input}
            />

            <Text style={styles.label}>Number of Members</Text>
            <TextInput
                placeholder="Enter number of members"
                value={members}
                onChangeText={setMembers}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Details (Optional)</Text>
            <TextInput
                placeholder="Enter additional details"
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

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});