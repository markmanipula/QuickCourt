import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path

interface IParticipant {
    name: string;
    // Removed 'paid' as it's not relevant for waitlist display
}

export default function WaitlistPage() {
    const { eventId } = useLocalSearchParams();
    const router = useRouter();
    const [waitlist, setWaitlist] = useState<IParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [organizerName, setOrganizerName] = useState<string | null>(null);

    useEffect(() => {
        const fetchWaitlist = async () => {
            if (!eventId) {
                setError("Event ID not provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch waitlist");
                }
                const data = await response.json();
                setWaitlist(data.waitlist); // Assuming the response contains the waitlist array
                setOrganizerName(data.organizer); // Assuming the response contains the organizer name
            } catch (err) {
                console.error("Error fetching waitlist:", err);
                setError("Failed to fetch waitlist.");
            } finally {
                setLoading(false);
            }
        };

        fetchWaitlist();
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

    if (loading) {
        return (
            <LinearGradient colors={['#3b82f6', '#1e3a8a']} style={styles.gradientContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading waitlist...</Text>
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
                <Text style={styles.header}>Current Waitlist</Text>

                {waitlist.length > 0 ? (
                    waitlist.map((participant, index) => (
                        <View key={index} style={styles.participantCard}>
                            <Text style={styles.participantName}>{participant.name}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noParticipants}>No one is on the waitlist yet.</Text>
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