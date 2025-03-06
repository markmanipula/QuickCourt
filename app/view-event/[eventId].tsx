import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons"; // Importing gradient component

export default function EventDetailsPage() {
    const { eventId } = useLocalSearchParams();
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const router = useRouter();
    const [participant, setParticipant] = useState<any>(null);
    const [isParticipant, setIsParticipant] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [onWaitlist, setOnWaitlist] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                setParticipant({ firstName, lastName });
            } else {
                setParticipant(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!eventId || !participant) return; // Ensure participant is available before fetching

        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                if (!response.ok) throw new Error('Failed to fetch event details');

                const data = await response.json();
                console.log("Event Details:", data);
                setEvent(data);

                const participantName = `${participant.firstName} ${participant.lastName}`;

                // Ensure state variables are correctly set
                setIsParticipant(data.participants?.some((p: { name: string }) => p.name === participantName) || false);
                setOnWaitlist(data.waitlist?.some((w: { name: string }) => w.name === participantName) || false);
                setIsOrganizer(data.organizer === participantName);
            } catch (err) {
                setError('Failed to fetch event details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId, participant]); // Ensure this runs after participant is set

    useEffect(() => {
        if (error) {
            router.back();
        }
    }, [error]);

    const handleJoinEvent = async () => {
        if (!eventId || !participant) return;

        // If the event requires a passcode
        if (event.passcode) {
            // Prompt the user to enter the passcode
            Alert.prompt(
                'Enter Passcode',
                'Please enter the passcode to join this event.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Join',
                        onPress: async (passcodeInput) => {
                            // Check if the passcode matches
                            if (passcodeInput === event.passcode) {
                                const participantName = `${participant.firstName} ${participant.lastName}`;
                                const eventData = {
                                    participant: participantName,
                                    passcode: passcodeInput // Include passcode here
                                };

                                setJoining(true);

                                try {
                                    const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/join`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(eventData),
                                    });

                                    const responseData = await response.json();
                                    if (!response.ok) throw new Error(responseData.error || 'Failed to join event');

                                    setEvent(responseData.event);
                                    setIsParticipant(true);
                                    alert('Successfully joined event!');
                                } catch (err: any) {
                                    alert(`Failed to join event: ${err.message}`);
                                } finally {
                                    setJoining(false);
                                }
                            } else {
                                alert('Incorrect passcode. Please try again.');
                            }
                        },
                    },
                ],
                'plain-text'
            );
        } else {
            // If there's no passcode, join the event directly
            const participantName = `${participant.firstName} ${participant.lastName}`;
            const eventData = { participant: participantName };

            setJoining(true);

            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventData),
                });

                const responseData = await response.json();
                if (!response.ok) throw new Error(responseData.error || 'Failed to join event');

                setEvent(responseData.event);
                setIsParticipant(true);
                alert('Successfully joined event!');
            } catch (err: any) {
                alert(`Failed to join event: ${err.message}`);
            } finally {
                setJoining(false);
            }
        }
    };

    const handleJoinWaitlist = async () => {
        if (!eventId || !participant) return;

        const participantName = `${participant.firstName} ${participant.lastName}`;

        // If the event requires a passcode for the waitlist
        if (event.passcode) {
            // Prompt the user to enter the passcode
            Alert.prompt(
                'Enter Passcode',
                'This event is invite-only. Please enter the passcode to join the waitlist.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Join Waitlist',
                        onPress: async (passcodeInput) => {
                            // Check if the provided passcode matches the event's passcode
                            if (passcodeInput === event.passcode) {
                                const eventData = {
                                    participant: participantName,
                                    passcode: passcodeInput // Include passcode here
                                };

                                setJoining(true);

                                try {
                                    const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/join`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(eventData),
                                    });

                                    const responseData = await response.json();
                                    if (!response.ok) throw new Error(responseData.error || 'Failed to join waitlist');

                                    setEvent(responseData.event);
                                    setOnWaitlist(true);
                                    alert('Successfully joined the waitlist!');
                                } catch (err: any) {
                                    alert(`Failed to join waitlist: ${err.message}`);
                                } finally {
                                    setJoining(false);
                                }
                            } else {
                                alert('Incorrect passcode. Please try again.');
                            }
                        },
                    },
                ],
                'plain-text' // You can use 'plain-text' to allow for text input
            );
        } else {
            // If there's no invite-only restriction, join the waitlist directly
            const eventData = { participant: participantName };

            setJoining(true);

            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventData),
                });

                const responseData = await response.json();
                if (!response.ok) throw new Error(responseData.error || 'Failed to join waitlist');

                setEvent(responseData.event);
                setOnWaitlist(true);
                alert('Successfully joined the waitlist!');
            } catch (err: any) {
                alert(`Failed to join waitlist: ${err.message}`);
            } finally {
                setJoining(false);
            }
        }
    };

    const handleLeaveWaitlist = async () => {
        if (!eventId || !participant) return;

        Alert.alert(
            "Leave Waitlist",
            "Are you sure you want to leave this waitlist?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Leave",
                    onPress: async () => {
                        const participantName = `${participant.firstName} ${participant.lastName}`;
                        const eventData = { participant: participantName };

                        setLeaving(true);

                        try {
                            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/leave`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(eventData),
                            });

                            const responseData = await response.json();
                            if (!response.ok) throw new Error(responseData.error || 'Failed to leave waitlist');

                            setEvent(responseData.event);
                            setOnWaitlist(false);
                            alert("Successfully left waitlist!");
                        } catch (err: any) {
                            alert(`Failed to leave waitlist: ${err.message}`);
                        } finally {
                            setLeaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleLeaveEvent = async () => {
        if (!eventId || !participant) return;

        Alert.alert(
            "Leave Event",
            "Are you sure you want to leave this event?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Leave",
                    onPress: async () => {
                        const participantName = `${participant.firstName} ${participant.lastName}`;
                        const eventData = {participant: participantName};

                        setLeaving(true);

                        try {
                            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/leave`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(eventData),
                            });

                            const responseData = await response.json();
                            if (!response.ok) throw new Error(responseData.error || 'Failed to leave event');

                            setEvent(responseData.event);
                            setIsParticipant(false);
                            alert("Successfully left event!");
                        } catch (err: any) {
                            alert(`Failed to leave event: ${err.message}`);
                        } finally {
                            setLeaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleEditEvent = () => {
        router.push(`/edit-event/${eventId}`);
    };

    const handleViewParticipants = () => {
        router.push(`/view-participants/${eventId}`);
    };

    const handleViewWaitlist = () => {
        router.push(`/view-waitlist/${eventId}`);
    };

    const handleDeleteEvent = async () => {
        if (!eventId) return;

        Alert.alert(
            "Delete Event",
            "Are you sure you want to delete this event? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`, {
                                method: "DELETE",
                            });

                            if (!response.ok) throw new Error("Failed to delete event");

                            alert("Event deleted successfully!");
                            router.replace("/"); // Redirect to home or event list page
                        } catch (err: any) {
                            alert(`Failed to delete event: ${err.message}`);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.container}>
                <Text>Event not found.</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f5d']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                    <View style={styles.backButtonContent}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.goBackText}>Back</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.eventHeader}>
                    <Text style={styles.header}>{event.title ?? "No Title"}</Text>
                    <Text style={styles.locationStyle}>Location: {event.location ?? "Unknown"}</Text>
                    <Text style={styles.details}>Date: {event.date ? new Date(event.date).toLocaleDateString() : "TBA"}</Text>
                    <Text style={styles.details}>Time: {event.time ?? "TBA"}</Text>
                    <Text style={styles.details}>Organizer: {event.organizer ?? "Unknown"}</Text>
                    <Text style={styles.details}>Max Participants: {event.maxParticipants ?? "N/A"}</Text>
                    <Text style={styles.details}>Current Participants: {event.participants?.length ?? 0}</Text>
                    <Text style={styles.details}>Cost: {event.cost === 0 ? "Free" : event.cost}</Text>
                    <Text style={styles.details}>Description: {event.details ?? "No details available"}</Text>
                    <Text style={styles.details}>{event.visibility ?? "N/A"}</Text>
                    {isOrganizer && event.passcode && (
                        <View style={styles.passcodeContainer}>
                            <Text style={styles.passcodeLabel}>Event Passcode:</Text>
                            <Text style={styles.passcodeText}>{event.passcode}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.viewParticipantsButton}
                    onPress={handleViewParticipants}
                >
                    <Text style={styles.viewParticipantsButtonText}>See Current Participants</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.viewParticipantsButton}
                    onPress={handleViewWaitlist}
                >
                    <Text style={styles.viewParticipantsButtonText}>See Current Waitlist</Text>
                </TouchableOpacity>

                {isOrganizer && (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditEvent}
                    >
                        <Text style={styles.editButtonText}>Edit Event</Text>
                    </TouchableOpacity>
                )}

                {isParticipant ? (
                    <TouchableOpacity
                        style={styles.leaveButton}
                        onPress={handleLeaveEvent}
                        disabled={leaving}
                    >
                        <Text style={styles.leaveButtonText}>
                            {leaving ? "Leaving..." : "Leave Event"}
                        </Text>
                    </TouchableOpacity>
                ) : onWaitlist ? (
                    <TouchableOpacity
                        style={styles.leaveButton}
                        onPress={handleLeaveWaitlist}
                        disabled={leaving}
                    >
                        <Text style={styles.leaveButtonText}>
                            {leaving ? "Leaving Waitlist..." : "Leave Waitlist"}
                        </Text>
                    </TouchableOpacity>
                ) : event.participants.length >= event.maxParticipants ? (
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={handleJoinWaitlist}
                        disabled={joining || !participant}
                    >
                        <Text style={styles.joinButtonText}>
                            {joining ? "Joining Waitlist..." : "Join Waitlist"}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={handleJoinEvent}
                        disabled={joining || !participant}
                    >
                        <Text style={styles.joinButtonText}>
                            {joining ? "Joining..." : "Join Event"}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View style={styles.buttonsWrapper}>
                {isOrganizer && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteEvent}
                    >
                        <Text style={styles.deleteButtonText}>Delete Event</Text>
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
}

// Container now has flex: 1 to take up full height
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'transparent',
        justifyContent: 'space-between', // Ensure the content is spaced out
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20, // Adjusted padding to allow space for buttons
    },
    eventHeader: {
        backgroundColor: '#1e3a8a',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    locationStyle: {
        fontSize: 16,
        color: '#e0e7ff',
        marginTop: 5,
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        color: '#e0e7ff',
        marginBottom: 10,
    },
    joinButton: {
        backgroundColor: '#2563eb',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    leaveButtonContainer: {
        paddingHorizontal: 20,
        marginTop: 15, // Added margin for spacing
    },
    leaveButton: {
        backgroundColor: '#dc2626',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    joinButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    leaveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    viewParticipantsButton: {
        backgroundColor: 'transparent', // Outlined button
        borderWidth: 2,
        borderColor: '#5eead4', // Lighter teal
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
    },
    viewParticipantsButtonText: {
        fontSize: 16,
        color: '#5eead4', // Matches border color
        textAlign: 'center',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#0d9488', // Darker teal
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    editButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
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
    // Add a wrapper to hold the Delete button at the bottom
    buttonsWrapper: {
        marginTop: 'auto', // This makes the Delete button move to the bottom
    },
    deleteButton: {
        backgroundColor: "#b91c1c",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    passcodeContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        alignItems: "center",
    },

    passcodeLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },

    passcodeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFD700", // Gold color for visibility
    },
});