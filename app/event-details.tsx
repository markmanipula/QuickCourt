// event-details.tsx
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {router, useLocalSearchParams} from "expo-router";

// Dummy data for events
const events = [
    { id: '1', title: 'Volleyball Match', location: 'Court 1', date: '02/15/2025', time: '5:00 PM', details: 'Exciting match!' },
    { id: '2', title: 'Beach Volleyball', location: 'Beach Court', date: '02/20/2025', time: '10:00 AM', details: 'Come join the fun!' },
];

export default function EventDetailsPage() {
    const { eventId } = useLocalSearchParams();

    // Find the event based on eventId
    const event = events.find((e) => e.id === eventId);

    if (!event) {
        return (
            <View style={styles.container}>
                <Text>Event not found!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.details}>{event.details}</Text>
            <Text style={styles.location}>Location: {event.location}</Text>
            <Text style={styles.date}>Date: {event.date}</Text>
            <Text style={styles.time}>Time: {event.time}</Text>

            {/* Back button to navigate back to the events list */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 18,
        marginVertical: 10,
    },
    location: {
        fontSize: 16,
    },
    date: {
        fontSize: 16,
    },
    time: {
        fontSize: 16,
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
});