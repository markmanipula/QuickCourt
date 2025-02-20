import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function EventDetailsPage() {
    const { eventId } = useLocalSearchParams();  // Get the eventId from the URL
    const [event, setEvent] = useState<any | null>(null); // State to hold event details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
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
            {event.participants && <Text style={styles.details}>Participants: {event.participants}</Text>}
            {event.cost && <Text style={styles.details}>Cost: {event.cost}</Text>}

            {/* Add other event details here, e.g., images, videos, etc. */}

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
});