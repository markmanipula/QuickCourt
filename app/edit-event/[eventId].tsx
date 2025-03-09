import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch, Modal } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { ENDPOINTS } from "../utils/api-routes";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditEventScreen() {
    const router = useRouter();
    const { eventId } = useLocalSearchParams();
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [dateTime, setDateTime] = useState<Date | null>(null); // Combined date and time
    const [cost, setCost] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [details, setDetails] = useState("");
    const [organizer, setOrganizer] = useState<any>(null);
    const [currentParticipants, setCurrentParticipants] = useState(0);
    const [inviteOnly, setInviteOnly] = useState(false);
    const [showPicker, setShowPicker] = useState(false); // For date/time picker modal
    const [tempDateTime, setTempDateTime] = useState<Date | null>(null); // Temporary date/time state

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
                const response = await fetch(ENDPOINTS.EVENT_BY_ID(eventId));
                const data = await response.json();
                if (data) {
                    setTitle(data.title);
                    setLocation(data.location);
                    setDateTime(new Date(data.dateTime)); // Use combined date/time
                    setCost(data.cost.toString());
                    setMaxParticipants(data.maxParticipants.toString());
                    setDetails(data.details || "");
                    setCurrentParticipants(data.participants.length || 0);
                    setInviteOnly(data.visibility === "invite-only");
                    console.log("Fetched event data:", data);
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };

        fetchEventData();

        return () => unsubscribe();
    }, [eventId]);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || tempDateTime || new Date();
        setTempDateTime(currentDate); // Update temporary date/time
    };

    const handleConfirmDateTime = () => {
        if (tempDateTime) {
            setDateTime(tempDateTime); // Set the final date/time
        }
        setShowPicker(false); // Close the modal
    };

    const handleCancelDateTime = () => {
        setTempDateTime(null); // Reset temporary date/time
        setShowPicker(false); // Close the modal
    };

    const handleSubmit = async () => {
        if (!title || !location || !maxParticipants || !cost || !organizer || !dateTime) {
            alert("Please fill out all required fields.");
            return;
        }

        if (currentParticipants > parseInt(maxParticipants)) {
            alert(`Cannot update event. Current participants (${currentParticipants}) exceed the new maximum (${maxParticipants}).`);
            return;
        }

        const eventDateTime = new Date(dateTime);

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
            dateTime: eventDateTime.toISOString(), // Use ISO string for consistency
            maxParticipants,
            cost,
            details: details || "N/A",
            organizer: organizerName,
            visibility: inviteOnly ? "invite-only" : "public",
        };

        console.log("submitted", eventData);

        try {
            const response = await fetch(ENDPOINTS.EVENT_BY_ID(eventId), {
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
            alert(`Event Updated`);
            router.back();
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Error updating event. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={['#d4eaf7', '#a9d6eb', '#f5faff']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                        <View style={styles.backButtonContent}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                            <Text style={styles.goBackText}>Back</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.heading}>Edit Event</Text>

                    <Text style={styles.label}>Event Title</Text>
                    <TextInput placeholder="Enter event title" value={title} onChangeText={setTitle} style={styles.input} />

                    <Text style={styles.label}>Address</Text>
                    <TextInput placeholder="Enter address" value={location} onChangeText={setLocation} style={styles.input} />

                    <Text style={styles.label}>Date & Time</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                        <Text style={{ color: dateTime ? "black" : "#aaa" }}>
                            {dateTime ? dateTime.toLocaleString() : "Pick Date & Time"}
                        </Text>
                    </TouchableOpacity>

                    {/* Date/Time Picker Modal */}
                    <Modal visible={showPicker} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <DateTimePicker
                                    value={tempDateTime || dateTime || new Date()} // Use temporary or final date/time
                                    mode="datetime"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                                <View style={styles.modalButtonsContainer}>
                                    <TouchableOpacity onPress={handleCancelDateTime} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleConfirmDateTime} style={styles.modalButton}>
                                        <Text style={styles.modalButtonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Text style={styles.label}>Max Participants</Text>
                    <TextInput placeholder="Enter max participants" value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="numeric" style={styles.input} />

                    <Text style={styles.label}>Cost ($)</Text>
                    <TextInput placeholder="Enter cost" value={cost} onChangeText={setCost} keyboardType="numeric" style={styles.input} />

                    <Text style={styles.label}>Details (Optional)</Text>
                    <TextInput placeholder="Enter additional details" value={details} onChangeText={setDetails} style={styles.input} />

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Invite-Only</Text>
                        <Switch value={inviteOnly} onValueChange={setInviteOnly} />
                    </View>

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
        justifyContent: "center",
        alignItems: "flex-start",
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "90%",
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: "#ffa722",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});