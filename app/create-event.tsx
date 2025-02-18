import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function CreateEventScreen() {
    const router = useRouter();
    const [title, setTitle] = useState(""); // Change to title
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [maxParticipants, setMaxParticipants] = useState(""); // Change to maxParticipants
    const [details, setDetails] = useState("");

    // Helper function to format date input as MM/DD/YYYY
    const formatDateInput = (text: string) => {
        let cleaned = text.replace(/\D/g, "");
        if (cleaned.length === 0) {
            setDate("");
            return;
        }

        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }

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

    const handleSubmit = async () => {
        if (!title || !location || !date || !maxParticipants) {
            alert("Please fill out all required fields.");
            return;
        }

        const eventData = {
            title, // Change to title
            location: location,
            date,
            maxParticipants: parseInt(maxParticipants, 10), // Change to maxParticipants
            details: details || "N/A", // Optional details field
        };

        try {
            console.log("Logging event data:", eventData);
            const response = await fetch("http://10.0.0.9:5001/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                console.log(response);
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Event created successfully:", data);

            alert(`Event Created:\n\nTitle: ${data.title}\nAddress: ${data.address}\nDate: ${data.date}\nMax Participants: ${data.maxParticipants}\nDetails: ${data.details || "N/A"}`);
            router.back();
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Go Back" onPress={() => router.back()} />

            <Text style={styles.heading}>Create a New Event</Text>

            <Text style={styles.label}>Event Title</Text> {/* Change to Event Title */}
            <TextInput
                placeholder="Enter event title"
                value={title} // Change to title
                onChangeText={setTitle} // Change to setTitle
                style={styles.input}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
                placeholder="Enter address"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
                placeholder="MM/DD/YYYY"
                value={date}
                onChangeText={formatDateInput}
                keyboardType="numeric"
                style={styles.input}
                maxLength={10}
            />

            <Text style={styles.label}>Max Participants</Text> {/* Change to Max Participants */}
            <TextInput
                placeholder="Enter max participants"
                value={maxParticipants} // Change to maxParticipants
                onChangeText={setMaxParticipants} // Change to setMaxParticipants
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