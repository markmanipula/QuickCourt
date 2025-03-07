import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";

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
    return (
        <View style={styles.card}>
            {/* Event Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Price & Invite Only Tags */}
            <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>${price}</Text>
                </View>
                {inviteOnly && (
                    <View style={[styles.tag, styles.inviteOnly]}>
                        <Text style={styles.tagText}>Invite Only</Text>
                    </View>
                )}
            </View>

            {/* Date & Time */}
            <View style={styles.infoRow}>
                <FontAwesome5 name="calendar-alt" size={16} color="white" />
                <Text style={styles.infoText}>{date}, {time}</Text>
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

            {/* Organizer */}
            <View style={styles.organizerRow}>
                <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.avatar} />
                <Text style={styles.organizerText}>{organizer}</Text>
            </View>

            {/* Description */}
            <Text style={styles.details}>
                {details !== "N/A" && details !== "No details" ? (
                    <Text style={styles.details}>{details}</Text>
                ) : null}
            </Text>

            {/* Passcode (Visible only if the user is the organizer) */}
            {passcode && (
                <View style={styles.passcodeContainer}>
                    <Text style={styles.passcodeLabel}>Event Passcode:</Text>
                    <Text style={styles.passcodeText}>{passcode}</Text>
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
    organizerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    organizerText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
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

    passcodeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFD700", // Gold color for visibility
    },
});

export default EventCard;