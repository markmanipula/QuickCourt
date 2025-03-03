import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path

interface IParticipant {
    name: string;
    paid: boolean;
}

export default function ParticipantsPage() {
    const { eventId } = useLocalSearchParams();
    const router = useRouter();
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [organizerName, setOrganizerName] = useState<string | null>(null);

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
                setOrganizerName(data.organizer); // Assuming the response contains the organizer name
            } catch (err) {
                console.error("Error fetching participants:", err);
                setError("Failed to fetch participants.");
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [eventId]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                const participantName = `${firstName} ${lastName}`;

                // Check if the current user is the organizer
                if (organizerName && participantName === organizerName) {
                    setIsOrganizer(true);
                }
            }
        });

        return () => unsubscribe();
    }, [organizerName]);

    const togglePaidStatus = async (participant: IParticipant) => {
        try {
            const updatedParticipants = participants.map(p =>
                p.name === participant.name ? { ...p, paid: !p.paid } : p
            );
            setParticipants(updatedParticipants); // Optimistic UI update

            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/participants/${participant.name}/toggle-paid`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error("Failed to update paid status");
            }
        } catch (error) {
            console.error("Error updating paid status:", error);
            setError("Could not update participant status.");
        }
    };

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
            <TouchableOpacity onPress={() => router.back()} style={styles.goBackButton}>
                <View style={styles.backButtonContent}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.goBackText}>Back</Text>
                </View>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Participants</Text>

                {participants.length > 0 ? (
                    participants.map((participant, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.participantCard, participant.paid && styles.paidBackground]}
                            onPress={() => isOrganizer && togglePaidStatus(participant)} // Only allow organized to toggle
                        >
                            <Text style={styles.participantName}>{participant.name}</Text>
                            <Text style={styles.paymentStatus}>
                                {participant.paid ? "Paid ✅" : "Not Paid ❌"}
                            </Text>
                        </TouchableOpacity>
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
        paddingTop: 60,
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
        width: '80%',
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
    paidBackground: {
        backgroundColor: 'rgba(0, 255, 0, 0.3)', // Greenish background for paid users
    },
    participantName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    paymentStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 5,
    },
    noParticipants: {
        fontSize: 16,
        color: '#e5e7eb',
        fontStyle: 'italic',
        marginTop: 20,
    },
    goBackButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        zIndex: 1,
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