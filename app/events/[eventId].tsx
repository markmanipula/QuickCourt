import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function EventDetailsPage() {
    const router = useRouter();
    const eventId = router.params?.eventId;  // Access eventId from params

    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) {
            setError("Event ID is missing.");
            setLoading(false);
            return;  // Ensure eventId exists before fetching
        }

        console.log("Fetching event details for ID:", eventId);  // Debug log

        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch event details");
                }
                const data = await response.json();
                console.log("Fetched event details:", data);  // Log fetched data
                setEvent(data);
            } catch (err) {
                setError('Failed to fetch event details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{event?.title}</Text>
            <Text>Location: {event?.location}</Text>
            <Text>Date: {new Date(event?.date).toLocaleDateString()}</Text>
            <Text>Details: {event?.details}</Text>
            <Text>Cost: {event?.cost}</Text>
            <Text>Max Participants: {event?.maxParticipants}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
});