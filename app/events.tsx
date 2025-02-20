import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);  // State to store events
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error state

    useEffect(() => {
        // Fetch events from the backend
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://10.0.0.9:5001/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);  // Set events data to state
            } catch (err) {
                setError('Failed to fetch events');
                console.error(err);
            } finally {
                setLoading(false);  // Set loading state to false
            }
        };

        fetchEvents();  // Fetch events on component mount
    }, []);

    const handleEventClick = (eventId: string) => {
        router.push(`/events/${eventId}`);  // Pass eventId as part of the URL
    };

    // Render loading state
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Render error state
    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Render events list
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>All Events</Text>
            {events.length > 0 ? (
                events.map((event) => (
                    <TouchableOpacity
                        key={event._id}  // Use event._id for the key
                        style={styles.eventItem}
                        onPress={() => handleEventClick(event._id)}  // Pass event._id to event details screen
                    >
                        {/* Ensure each piece of data is valid before rendering */}
                        <Text>{event.title ? event.title : "No Title"}</Text>
                        <Text>{event.location ? event.location : "No Location"}</Text>
                        <Text>{event.date ? new Date(event.date).toLocaleDateString() : "No Date"}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noEventsText}>No events available.</Text>  // Display a message if no events
            )}

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
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
    },
    eventItem: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#ccc",
        borderRadius: 5,
        alignItems: "center",
    },
    backButtonText: {
        color: "#000",
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    noEventsText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
    },
});