// events.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {router, useRouter} from "expo-router";
import React from "react";

// Dummy data for events (you can fetch from an API or database)
const events = [
    { id: '1', title: 'Volleyball Match', location: 'Court 1', date: '02/15/2025', time: '5:00 PM', details: 'Exciting match!' },
    { id: '2', title: 'Beach Volleyball', location: 'Beach Court', date: '02/20/2025', time: '10:00 AM', details: 'Come join the fun!' },
];

export default function EventsPage() {
    const router = useRouter();

    const handleEventClick = (eventId) => {
        router.push({
            pathname: '/event-details',
            params: { eventId }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>All Events</Text>
            {events.map((event) => (
                <TouchableOpacity
                    key={event.id}
                    style={styles.eventItem}
                    onPress={() => handleEventClick(event.id)}
                >
                    <Text>{event.title}</Text>
                    <Text>{event.location}</Text>
                    <Text>{event.date}</Text>
                    <Text>{event.time}</Text>
                </TouchableOpacity>
            ))}

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
});