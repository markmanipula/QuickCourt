import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from "@expo/vector-icons"; // Added Feather for clipboard icon
import * as Clipboard from 'expo-clipboard'; // Import Clipboard from expo

interface EventCardProps {
    title: string;
    price: string;
    inviteOnly: boolean;
    date: string;
    time: string;
    location: string;
    participants: string;
    organizer: string;
    details: string;
    passcode: string;
}

const EventCard: React.FC<EventCardProps> = ({
                                                 title,
                                                 price,
                                                 inviteOnly,
                                                 date,
                                                 time,
                                                 location,
                                                 participants,
                                                 organizer,
                                                 details,
                                                 passcode
                                             }) => {
    const handleCopy = () => {
        if (passcode) {
            Clipboard.setString(passcode); // Copies the passcode to clipboard
            alert("Passcode copied!"); // Optional: Add some feedback for the user
        }
    };

    return (
        <View style={styles.card}>
            {/* Title and Date/Time inline */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.dateTimeContainer}>
                    <FontAwesome5 name="calendar-alt" size={18} color="white" />
                    <Text style={styles.dateTime}>{date}, {time}</Text>
                </View>
            </View>

            {/* Price & Invite Only Tags */}
            <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>${price}</Text>
                </View>
                {inviteOnly ? (
                    <View style={[styles.tag, styles.inviteOnly]}>
                        <Text style={styles.tagText}>Invite Only</Text>
                    </View>
                ) : (
                    <View style={[styles.tag, styles.public]}>
                        <Text style={styles.tagText}>Public</Text>
                    </View>
                )}
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="white" />
                <Text style={styles.infoText}>{location}</Text>
            </View>

            {/* Participants */}
            <View style={styles.infoRow}>
                <MaterialIcons name="groups" size={18} color="white" />
                <Text style={styles.infoText}>Participants {participants}</Text>
            </View>

            {/* Description */}
            {details !== "N/A" && details !== "No details" && details ? (
                <Text style={styles.details}>{details}</Text>
            ) : null}

            {/* Passcode (Visible only if the user is the organizer) */}
            {passcode && (
                <View style={styles.passcodeContainer}>
                    <Text style={styles.passcodeLabel}>Event Passcode:</Text>
                    <View style={styles.passcodeRow}>
                        <Text style={styles.passcodeText}>{passcode}</Text>
                        <TouchableOpacity onPress={handleCopy}>
                            <Feather name="clipboard" size={20} color="#FFD700" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#3F2D91", // Purple Background
        padding: 20,
        borderRadius: 15,
        margin: 10,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    dateTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateTime: {
        fontSize: 14,
        fontWeight: "bold",
        color: "white",
        marginLeft: 8,
    },
    tagsContainer: {
        flexDirection: "row",
        marginTop: 8,
    },
    tag: {
        backgroundColor: "#000",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginRight: 6,
    },
    inviteOnly: {
        backgroundColor: "#5A5A5A",
    },
    public: {
        backgroundColor: "#4CAF50", // Green background for public events
    },
    tagText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    infoText: {
        color: "white",
        marginLeft: 8,
        fontSize: 14,
    },
    details: {
        color: "white",
        marginTop: 12,
        fontSize: 12,
    },
    passcodeContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        alignItems: "center",
    },
    passcodeLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    passcodeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    passcodeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFD700", // Gold color for visibility
        marginRight: 10,
    },
});

export default EventCard;