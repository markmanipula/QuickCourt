import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

export default function EditEventScreen() {
    const router = useRouter();
    const { eventId } = useLocalSearchParams();
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [cost, setCost] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [details, setDetails] = useState("");
    const [organizer, setOrganizer] = useState<any>(null);
    const [currentParticipants, setCurrentParticipants] = useState(0);

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
                router.replace("/login");
            }
        });

        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                const data = await response.json();
                if (data) {
                    setTitle(data.title);
                    setLocation(data.location);
                    setDate(new Date(data.date).toLocaleDateString("en-US"));
                    setTime(data.time);
                    setCost(data.cost.toString());
                    setMaxParticipants(data.maxParticipants.toString());
                    setDetails(data.details || "");
                    setCurrentParticipants(data.participants.length || 0);
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

        if (currentParticipants > parseInt(maxParticipants)) {
            alert(`Cannot update event. Current participants (${currentParticipants}) exceed the new maximum (${maxParticipants}).`);
            return;
        }

        // Convert MM/DD/YYYY to YYYY-MM-DD for proper Date parsing
        const [month, day, year] = date.split("/");
        const formattedDate = `${year}-${month}-${day}`;

        // Construct an ISO-compliant date-time string
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
            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                console.error("Error response:", await response.text());
                return;
            }

            const data = await response.json();
            alert(`Event Updated:\n\nTitle: ${data.title}\nAddress: ${data.location}\nDate: ${data.date}\nTime: ${data.time}\nMax Participants: ${data.maxParticipants}\nCost: ${data.cost}\nDetails: ${data.details || "N/A"}\nOrganizer: ${organizerName}`);
            router.back();
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Error updating event. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f5d']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                        <View style={styles.backButtonContent}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                            <Text style={styles.goBackText}>Back</Text>
                        </View>
                    </TouchableOpacity>

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

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Update Event</Text>
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
        color: "#fff",
        marginLeft: 8,
    },
});