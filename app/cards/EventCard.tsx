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
            {/* Event Title */}
            <Text style={styles.title}>{title}</Text>

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

            {/* Date & Time */}
            <View style={styles.infoRow}>
                <FontAwesome5 name="calendar-alt" size={24} color="white" /> {/* Increased size from 16 to 24 */}
                <View style={styles.dateContainer}>
                    <Text style={styles.infoText}>{date}</Text>
                    <Text style={styles.infoText}>{time}</Text> {/* Display time below date */}
                </View>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="white" />
                <Text style={styles.infoText}>{location}</Text>
            </View>

            {/* Bottom row for organizer and participants */}
            <View style={styles.bottomRow}>
                {/* Organizer */}
                <View style={styles.organizerRow}>
                    <MaterialIcons name="person" size={24} color="white" />
                    <View style={styles.organizerTextContainer}>
                        <Text style={styles.organizerLabel}>Organizer</Text>
                        <Text style={styles.organizerName}>{organizer}</Text>
                    </View>
                </View>

                {/* Participants */}
                <View style={styles.infoRow}>
                    <MaterialIcons name="groups" size={18} color="white" />
                    <Text style={styles.infoText}>Participants {participants}</Text>
                </View>
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
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
    infoText: {
        color: "white",
        marginLeft: 8,
        fontSize: 14,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    organizerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    organizerTextContainer: {
        marginLeft: 10,
    },
    organizerLabel: {
        fontSize: 12,
        color: "white",
        fontWeight: "bold",
    },
    organizerName: {
        fontSize: 14,
        color: "white",
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
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start", // Align items to the top
        marginTop: 10,
    },
    dateContainer: {
        marginLeft: 8, // Add some space between icon and text
    },
});

export default EventCard;