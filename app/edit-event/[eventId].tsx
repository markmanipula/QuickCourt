// Screen for editing an event

import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path
import { styles } from "@/syles/styles";

export default function EditEventScreen() {
    const router = useRouter();
    const { eventId } = useLocalSearchParams(); // Assuming eventId is passed as a URL parameter
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [cost, setCost] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [details, setDetails] = useState("");
    const [organizer, setOrganizer] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                setOrganizer({ firstName, lastName });
                console.log("Fetched organizer:", { firstName, lastName });
            } else {
                router.replace("/login"); // Redirect to login if not logged in
            }
        });

        // Fetch event data (example: by eventId)
        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                const data = await response.json();
                if (data) {
                    setTitle(data.title);
                    setLocation(data.location);
                    setDate(data.date);
                    setTime(data.time);
                    setCost(data.cost);
                    setMaxParticipants(data.maxParticipants);
                    setDetails(data.details || "");
                    console.log("Fetched event data:", data);
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };

        fetchEventData();

        return () => unsubscribe();
    }, [eventId]);

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

    const formatTimeInput = (text: string) => {
        let cleaned = text.replace(/\D/g, "");
        if (cleaned.length === 0) {
            setTime("");
            return;
        }

        if (cleaned.length > 4) {
            cleaned = cleaned.slice(0, 4);
        }

        let formattedTime = "";
        if (cleaned.length <= 2) {
            formattedTime = cleaned;
        } else {
            formattedTime = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
        }

        setTime(formattedTime);
    };

    const handleSubmit = async () => {
        if (!title || !location || !date || !time || !maxParticipants || !cost || !organizer) {
            alert("Please fill out all required fields.");
            return;
        }

        const organizerName = `${organizer.firstName} ${organizer.lastName}`;

        const eventData = {
            title,
            location,
            date,
            time,
            maxParticipants,
            cost,
            details: details || "N/A",
            organizer: organizerName,
        };

        try {
            console.log("Logging event data:", eventData);
            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`, {
                method: "PUT", // Update request
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
            console.log("Event updated successfully:", data);

            alert(`Event Updated:\n\nTitle: ${data.title}\nAddress: ${data.location}\nDate: ${data.date}\nTime: ${data.time}\nMax Participants: ${data.maxParticipants}\nCost: ${data.cost}\nDetails: ${data.details || "N/A"}\nOrganizer: ${organizerName}`);
            router.back();
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Error updating event. Please try again.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Button title="Go Back" onPress={() => router.back()} />

            <Text style={styles.heading}>Edit Event</Text>

            <Text style={styles.label}>Event Title</Text>
            <TextInput
                placeholder="Enter event title"
                value={title}
                onChangeText={setTitle}
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

            <Text style={styles.label}>Time</Text>
            <TextInput
                placeholder="HH:MM"
                value={time}
                onChangeText={formatTimeInput}
                keyboardType="numeric"
                style={styles.input}
                maxLength={5}
            />

            <Text style={styles.label}>Max Participants</Text>
            <TextInput
                placeholder="Enter max participants"
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Cost ($)</Text>
            <TextInput
                placeholder="Enter cost"
                value={cost}
                onChangeText={setCost}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Details (Optional)</Text>
            <TextInput
                placeholder="Enter additional details"
                value={details}
                onChangeText={setDetails}
                style={styles.input}
            />

            <Button title="Update Event" onPress={handleSubmit} />
        </ScrollView>
    );
}