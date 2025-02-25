import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

export default function ParticipantsPage() {
    const { eventId } = useLocalSearchParams();
    const router = useRouter();
    const [participants, setParticipants] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            if (!eventId) {
                setError("Event ID not provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch participants");
                }
                const data = await response.json();
                setParticipants(data.participants);
            } catch (err) {
                console.error("Error fetching participants:", err);
                setError("Failed to fetch participants.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [eventId]);

    if (loading) {
        return (
            <LinearGradient colors={['#3b82f6', '#1e3a8a']} style={styles.gradientContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading participants...</Text>
            </LinearGradient>
        );
    }

    if (error) {
        return (
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f5d']} style={styles.gradientContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                    <View style={styles.backButtonContent}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                        <Text style={styles.goBackText}>Go Back</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f5d']} style={styles.gradientContainer}>
            {/* Back button outside the ScrollView */}
            <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                <View style={styles.backButtonContent}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.goBackText}>Back</Text>
                </View>
            </TouchableOpacity>

            {/* ScrollView for the content */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Participants</Text>

                {participants.length > 0 ? (
                    participants.map((participant, index) => (
                        <View key={index} style={styles.participantCard}>
                            <Text style={styles.participantName}>{participant}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noParticipants}>No participants yet.</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        paddingTop: 60, // Padding top to ensure the back button doesn't overlap content
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    participantCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    participantName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    noParticipants: {
        fontSize: 16,
        color: '#e5e7eb',
        fontStyle: 'italic',
        marginTop: 20,
    },
    goBackButton: {
        position: 'absolute', // Absolute positioning
        top: 20, // Top of the screen
        left: 20, // Left of the screen
        flexDirection: "row", // Aligns the icon and text in a row
        alignItems: "center", // Centers them vertically
        marginBottom: 16,
        zIndex: 1, // Ensures the button stays on top of other elements
    },
    backButtonContent: {
        flexDirection: "row", // Ensures icon and text are in the same row
        alignItems: "center",
    },
    goBackText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 8, // Adds space between the icon and the text
    },
    errorText: {
        fontSize: 16,
        color: '#fca5a5',
        textAlign: 'center',
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 16,
        color: '#e5e7eb',
        marginTop: 10,
    },
});