import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import {ENDPOINTS} from "@/app/utils/constants";

export default function CreateEventScreen() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [cost, setCost] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [details, setDetails] = useState("");
    const [isInviteOnly, setIsInviteOnly] = useState(false); // New state for event privacy
    const [organizer, setOrganizer] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                setOrganizer({ firstName, lastName });
            } else {
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, []);

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
        const [month, day, year] = date.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        const eventDateTime = new Date(`${formattedDate}T${time}:00`);

        if (isNaN(eventDateTime.getTime())) {
            alert("Invalid date or time format. Please enter a valid date and time.");
            return;
        }

        const currentDateTime = new Date();
        if (eventDateTime < currentDateTime) {
            alert("The event date and time cannot be in the past.");
            return;
        }

        const eventData = {
            title,
            location,
            date,
            time,
            maxParticipants,
            cost,
            details: details || "N/A",
            organizer: organizerName,
            visibility: isInviteOnly ? "invite-only" : "public", // Use visibility instead of isInviteOnly
        };

        try {
            console.log("Logging event data:", eventData);
            const response = await fetch(ENDPOINTS.EVENTS , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Event created successfully:", data);

            alert("Successfully created event!");
            router.push(`/view-event/${data._id}`);
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={['#d4eaf7', '#a9d6eb', '#f5faff']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                        <View style={styles.backButtonContent}>
                            <Ionicons name="arrow-back" size={24} color="2c2c2c" />
                            <Text style={styles.goBackText}>Back</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.heading}>Create a New Event</Text>

                    <Text style={styles.label}>Event Title</Text>
                    <TextInput placeholder="Enter event title" value={title} onChangeText={setTitle} style={styles.input} />

                    <Text style={styles.label}>Address</Text>
                    <TextInput placeholder="Enter address" value={location} onChangeText={setLocation} style={styles.input} />

                    <Text style={styles.label}>Date</Text>
                    <TextInput placeholder="MM/DD/YYYY" value={date} onChangeText={formatDateInput} keyboardType="numeric" style={styles.input} maxLength={10} />

                    <Text style={styles.label}>Time</Text>
                    <TextInput placeholder="HH:MM" value={time} onChangeText={formatTimeInput} keyboardType="numeric" style={styles.input} maxLength={5} />

                    <Text style={styles.label}>Max Participants</Text>
                    <TextInput placeholder="Enter max participants" value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="numeric" style={styles.input} />

                    <Text style={styles.label}>Cost ($)</Text>
                    <TextInput placeholder="Enter cost" value={cost} onChangeText={setCost} keyboardType="numeric" style={styles.input} />

                    <Text style={styles.label}>Details (Optional)</Text>
                    <TextInput placeholder="Enter additional details" value={details} onChangeText={setDetails} style={styles.input} />

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Invite-Only</Text>
                        <Switch value={isInviteOnly} onValueChange={setIsInviteOnly} />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Create Event</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingLeft: 24,  // Added padding to move content left
        backgroundColor: "#f9f9f9",
    },
    scrollContainer: {
        paddingBottom: 32,  // Added padding to bottom of the ScrollView for a more comfortable scroll
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        marginVertical: 8,
        fontWeight: "600",
    },
    input: {
        height: 48,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 12,
        backgroundColor: "white",
        fontSize: 16,
        marginBottom: 16,
        width: "100%",  // Full width for inputs
    },
    submitButton: {
        backgroundColor: "#ffa722",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    goBackButton: {
        flexDirection: "row", // Aligns the icon and text in a row
        alignItems: "center", // Centers them vertically
        marginBottom: 16,
    },
    backButtonContent: {
        flexDirection: "row", // Makes sure icon and text are in the same row
        alignItems: "center",
    },
    goBackText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c2c2c",
        marginLeft: 8, // Adds space between the icon and the text
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff", // Light background for contrast
        borderRadius: 10,
        padding: 10,
    },
});