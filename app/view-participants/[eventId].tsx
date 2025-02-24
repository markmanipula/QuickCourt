import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from "@/styles/styles";

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
                console.log("data here: ", data)
                // Assuming the API returns an array of participant names (strings)
                setParticipants(data.participants);
            } catch (err) {
                console.log(err)
                console.error("Error fetching participants:", err);
                setError("Failed to fetch participants");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
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
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Participants</Text>
            {participants.length > 0 ? (
                participants.map((participant, index) => (
                    <Text key={index} style={styles.participantName}>
                        {participant}
                    </Text>
                ))
            ) : (
                <Text style={styles.noParticipants}>No participants yet.</Text>
            )}

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}