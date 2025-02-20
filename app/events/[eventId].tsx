import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat";
import { auth } from "@/firebaseConfig"; // Ensure the correct path

export default function EventDetailsPage() {
    const { eventId } = useLocalSearchParams();  // Get the eventId from the URL
    const [event, setEvent] = useState<any | null>(null); // State to hold event details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false); // Track joining state
    const router = useRouter();
    const [participant, setParticipant] = useState<any>(null); // User info

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""; // Last name can be multiple words
                setParticipant({ firstName, lastName });
                console.log("Fetched participant:", { firstName, lastName }); // Debugging output
            } else {
                console.log("No user logged in.");
                setParticipant(null); // Reset if no user
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []); // Run only once on mount

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) {
                setError("Event ID not provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`); // Replace with your backend URL
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const data = await response.json();
                setEvent(data);  // Set the event details
            } catch (err) {
                setError('Failed to fetch event details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]); // Re-fetch if eventId changes

    useEffect(() => {
        if (error) {
            // Go back if there's an error
            router.back();
        }
    }, [error]); // This effect runs when error state changes

    // Function to join the event
    const handleJoinEvent = async () => {
        if (!eventId) {
            console.log("Error: No event ID provided.");
            setError("Event ID not provided.");
            return;
        }

        if (!participant) {
            console.log("Error: Participant not available.");
            setError("Unable to retrieve participant information.");
            return;
        }

        const participantName = `${participant.firstName} ${participant.lastName}`;

        const eventData = {
            participant: participantName
        };

        setJoining(true);
        console.log("Attempting to join event for participant:", eventData);

        try {
            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Handle backend errors
                throw new Error(responseData.error || 'Failed to join event');
            }

            const updatedEvent = responseData.event; // Assuming the updated event data is returned
            console.log("Updated event data after joining:", updatedEvent);
            setEvent(updatedEvent);

        } catch (err: any) {
            console.log(err);
            console.error("Error joining event:", err);
            // Show alert with the error message from the backend
            alert(`Failed to join event: ${err.message}`);
        } finally {
            setJoining(false);
        }
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{event.title}</Text>
            <Text style={styles.details}>Location: {event.location}</Text>
            <Text style={styles.details}>Date: {new Date(event.date).toLocaleDateString()}</Text>
            {event.time && <Text style={styles.details}>Time: {event.time}</Text>}
            {event.details && <Text style={styles.details}>Description: {event.details}</Text>}
            {event.organizer && <Text style={styles.details}>Organizer: {event.organizer}</Text>}
            {event.maxParticipants && <Text style={styles.details}>Max Participants: {event.maxParticipants}</Text>}
            {event.participants && <Text style={styles.details}>Participants: {event.participants.length}</Text>}
            {event.cost && <Text style={styles.details}>Cost: {event.cost}</Text>}

            {/* Join Event Button */}
            <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinEvent}
                disabled={joining || !participant} // Disable if participant is not set
            >
                <Text style={styles.joinButtonText}>{joining ? "Joining..." : "Join Event"}</Text>
            </TouchableOpacity>

            <Text onPress={() => router.back()} style={styles.backButtonText}>Back</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        marginBottom: 10,
    },
    backButtonText: {
        marginTop: 20,
        color: "#000",
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    joinButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});