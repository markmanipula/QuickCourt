import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';

interface EventCardProps {
    title: string;
    price: string;
    inviteOnly: boolean;
    dateTime: Date;
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
                                                 dateTime,
                                                 location,
                                                 participants,
                                                 organizer,
                                                 details,
                                                 passcode
                                             }) => {
    const handleCopy = (text: string) => {
        Clipboard.setString(text);
        alert("Copied to clipboard!");
    };

    const formattedDate = dateTime.toLocaleDateString("en-US", {
        weekday: "short", // 'Mon'
        month: "numeric",   // 'Jan'
        day: "numeric",   // '3'
        year: "numeric",  // '2025'
    });

    const formattedTime = dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",   // '1'
        minute: "numeric", // '40'
        hour12: true,      // 'pm'
    });

    return (
        <View style={styles.card}>
            {/* Header */}
            <Text style={styles.title}>{title}</Text>

            {/* Price, Invite-Only, and Date/Time */}
            <View style={styles.topRow}>
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
                <View style={styles.dateTimeContainer}>
                    <FontAwesome5 name="calendar-alt" size={24} color="white" />
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.infoText}>{formattedDate}</Text>
                        <Text style={styles.timeText}>{formattedTime}</Text>
                    </View>
                </View>
            </View>

            {/* Organizer and Participants */}
            <View style={styles.middleRow}>
                <View style={styles.organizerRow}>
                    <MaterialIcons name="person" size={24} color="white" />
                    <View style={styles.organizerTextContainer}>
                        <Text style={styles.organizerLabel}>Organizer</Text>
                        <Text style={styles.organizerName}>{organizer}</Text>
                    </View>
                </View>
                <View style={styles.participantsContainer}>
                    <MaterialIcons name="groups" size={22} color="white" />
                    <Text style={styles.participantsText}>Participants: {participants}</Text>
                </View>
            </View>

            {/* Address and Copy Icon */}
            <View style={styles.addressContainer}>
                <Ionicons name="location-outline" size={24} color="white" />
                <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">
                    {location}
                </Text>
                <TouchableOpacity onPress={() => handleCopy(location)}>
                    <Feather name="copy" size={20} color="#FFD700" />
                </TouchableOpacity>
            </View>

            {/* Description */}
            {details && details !== "N/A" && details !== "No details" ? (
                <Text style={styles.details}>Details: {details}</Text>
            ) : null}

            {/* Passcode (Visible only if the user is the organizer) */}
            {passcode && (
                <View style={styles.passcodeContainer}>
                    <Text style={styles.passcodeLabel}>Event Passcode:</Text>
                    <View style={styles.passcodeRow}>
                        <Text style={styles.passcodeText}>{passcode}</Text>
                        <TouchableOpacity onPress={() => handleCopy(passcode)}>
                            <Feather name="clipboard" size={20} color="#FFD700" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const { width } = Dimensions.get("window"); // Get screen width

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#5485bc",
        padding: 15,
        borderRadius: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10, // Adds spacing below the title
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10, // Adds spacing below the top row
    },
    tagsContainer: {
        flexDirection: "row",
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
        backgroundColor: "#4CAF50",
    },
    tagText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    dateTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateTextContainer: {
        marginLeft: 8,
    },
    infoText: {
        color: "white",
        fontSize: 14,
    },
    participantsText: {
        color: "white",
        fontSize: 14,
        marginLeft: 6,
    },
    timeText: {
        color: "white",
        fontSize: 14,
    },
    middleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10, // Adds spacing below the middle row
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
    participantsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        color: "white",
        marginLeft: 8,
        fontSize: 14,
        flex: 1, // Allows the text to wrap and take up available space
        maxWidth: width * 0.7, // Limits address width to 70% of the card's width
    },
    details: {
        color: "white",
        marginTop: 12,
        fontSize: 12,
    },
    passcodeContainer: {
        marginTop: 10,
        padding: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        alignItems: "center",
    },
    passcodeLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    },
    passcodeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    passcodeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFD700",
        marginRight: 6,
    },
});

export default EventCard;