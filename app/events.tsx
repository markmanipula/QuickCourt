import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://10.0.0.9:5001/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();

                // Filter out past events
                const upcomingEvents = data.filter((event: { date: string | number | Date; }) => new Date(event.date) >= new Date());

                setEvents(upcomingEvents);
            } catch (err) {
                setError('Failed to fetch events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleEventClick = (eventId: string) => {
        router.push(`/view-event/${eventId}`);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setLoading(true)} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f5d']} style={styles.gradientContainer}>
            <ScrollView style={styles.container}>
                <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                    <View style={styles.backButtonContent}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.goBackText}>Back</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.header}>Upcoming Events</Text>
                {events.length > 0 ? (
                    events.map((event) => (
                        <TouchableOpacity
                            key={event._id}
                            style={styles.eventCard}
                            onPress={() => handleEventClick(event._id)}
                        >
                            <Text style={styles.eventTitle}>{event.title || "No Title"}</Text>
                            <Text style={styles.eventOrganizer}>Organizer: {event.organizer || "No Organizer"}</Text>
                            <Text style={styles.eventDate}>Date: {event.date ? new Date(event.date).toLocaleDateString() : "No Date"}</Text>
                            <Text style={styles.eventType}>{event.visibility ?? "N/A"}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noEventsText}>No upcoming events available.</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

// Styles
const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "transparent",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#fff",
    },
    eventCard: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#1e3a8a",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    eventTitle: {
        fontSize: 18,
        color: "#e0e7ff",
        fontWeight: "600",
        marginBottom: 5,
    },
    eventLocation: {
        fontSize: 14,
        color: "#e0e7ff",
        marginBottom: 5,
    },
    eventOrganizer: {
        fontSize: 14,
        color: "#e0e7ff",
        marginBottom: 5,
    },
    eventDate: {
        fontSize: 14,
        color: "#e0e7ff",
        marginBottom: 5,
    },
    eventType: {
        fontSize: 14,
        color: "#e0e7ff",
    },
    noEventsText: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 20,
        color: "#fff",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    retryButtonText: {
        color: "#fff",
        fontWeight: "bold",
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