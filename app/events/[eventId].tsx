// Dynamic route for viewing a single event

import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path
import {styles} from "@/syles/styles";

export default function EventDetailsPage() {
    const { eventId } = useLocalSearchParams();
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const router = useRouter();
    const [participant, setParticipant] = useState<any>(null);
    const [isParticipant, setIsParticipant] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false); // NEW: Track if user is the organizer

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                setParticipant({ firstName, lastName });
            } else {
                setParticipant(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) {
                setError("Event ID not provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://10.0.0.9:5001/events/${eventId}`);
                if (!response.ok) throw new Error('Failed to fetch event details');

                const data = await response.json();
                setEvent(data);

                if (data.participants && participant) {
                    const participantName = `${participant.firstName} ${participant.lastName}`;
                    setIsParticipant(data.participants.includes(participantName));
                }

                // NEW: Check if the current user is the event organizer
                if (participant) {
                    const participantName = `${participant.firstName} ${participant.lastName}`;
                    setIsOrganizer(data.organizer === participantName);
                }
            } catch (err) {
                setError('Failed to fetch event details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId, participant]);

    useEffect(() => {
        if (error) {
            router.back();
        }
    }, [error]);

    const handleJoinEvent = async () => {
        if (!eventId || !participant) return;

        const participantName = `${participant.firstName} ${participant.lastName}`;
        const eventData = { participant: participantName };

        setJoining(true);

        try {
            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || 'Failed to join event');

            setEvent(responseData.event);
            setIsParticipant(true);
            alert(`Successfully joined event!`);
        } catch (err: any) {
            alert(`Failed to join event: ${err.message}`);
        } finally {
            setJoining(false);
        }
    };

    const handleLeaveEvent = async () => {
        if (!eventId || !participant) return;

        const participantName = `${participant.firstName} ${participant.lastName}`;
        const eventData = { participant: participantName };

        setLeaving(true);

        try {
            const response = await fetch(`http://10.0.0.9:5001/events/${eventId}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || 'Failed to leave event');

            setEvent(responseData.event);
            setIsParticipant(false);
            alert(`Successfully left event!`);
        } catch (err: any) {
            alert(`Failed to leave event: ${err.message}`);
        } finally {
            setLeaving(false);
        }
    };

    const handleEditEvent = () => {
        router.push(`/edit-event/${eventId}`);  // Navigate to the correct edit event route
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
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
            {event.participants && <Text style={styles.details}>Participants: {event.participants.length}</Text>}
            {event.cost && <Text style={styles.details}>Cost: {event.cost}</Text>}

            {!isParticipant ? (
                <TouchableOpacity
                    style={styles.joinButton}
                    onPress={handleJoinEvent}
                    disabled={joining || !participant}
                >
                    <Text style={styles.joinButtonText}>
                        {joining ? "Joining..." : "Join Event"}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={handleLeaveEvent}
                    disabled={leaving}
                >
                    <Text style={styles.leaveButtonText}>
                        {leaving ? "Leaving..." : "Leave Event"}
                    </Text>
                </TouchableOpacity>
            )}

            {/* NEW: Show "Edit Event" button if the user is the organizer */}
            {isOrganizer && (
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditEvent}
                >
                    <Text style={styles.editButtonText}>Edit Event</Text>
                </TouchableOpacity>
            )}

            <Text onPress={() => router.back()} style={styles.backButtonText}>Back</Text>
        </ScrollView>
    );
}