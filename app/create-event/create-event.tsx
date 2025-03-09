import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { ENDPOINTS } from "@/app/utils/constants";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [cost, setCost] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [details, setDetails] = useState("");
    const [isInviteOnly, setIsInviteOnly] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
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

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dateTime || new Date();
        setShowPicker(false);
        setDateTime(currentDate);
    };

    const handleSubmit = async () => {
        if (!title || !location || !maxParticipants || !cost || !organizer) {
            alert("Please fill out all required fields.");
            return;
        }

        const organizerName = `${organizer.firstName} ${organizer.lastName}`;
        const eventDateTime = dateTime ? new Date(dateTime) : new Date(); // Ensure it's a valid date

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
            dateTime: eventDateTime.toISOString(),
            maxParticipants,
            cost,
            details: details || "N/A",
            organizer: organizerName,
            visibility: isInviteOnly ? "invite-only" : "public",
        };

        try {
            console.log("Logging event data:", eventData);
            const response = await fetch(ENDPOINTS.EVENTS, {
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

                    <Text style={styles.label}>Date & Time</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                        <Text>{dateTime ? dateTime.toLocaleString() : "Pick Date & Time"} </Text>
                    </TouchableOpacity>
                    {showPicker ? (
                        <DateTimePicker
                            value={dateTime || new Date()} // Fallback to current date
                            mode="datetime"
                            display="default"
                            onChange={handleDateChange}
                        />
                    ) : null}

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
        paddingLeft: 24,
        backgroundColor: "#f9f9f9",
    },
    scrollContainer: {
        paddingBottom: 32,
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
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start",  // Align text to the left
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
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    goBackText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c2c2c",
        marginLeft: 8,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
    },
});