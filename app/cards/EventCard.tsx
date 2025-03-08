import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';

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
            Clipboard.setString(passcode);
            alert("Passcode copied!");
        }
    };

    return (
        <View style={styles.card}>
            {/* Event Title and Date */}
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.dateContainer}>
                    <View style={styles.infoRow}>
                        <FontAwesome5 name="calendar-alt" size={24} color="white" />
                        <View style={styles.dateTextContainer}>
                            <Text style={styles.infoText}>{date}</Text>
                            <Text style={styles.infoText}>{time}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Price, Invite Only Tags and Location */}
            <View style={styles.addressContainer}>
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
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={18} color="white" />
                    <Text style={styles.infoText}>{location}</Text>
                </View>
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
                    <MaterialIcons name="groups" size={22} color="white" />
                    <Text style={styles.infoText}>Participants {participants}</Text>
                </View>
            </View>

            {/* Description */}
            {details && details !== "N/A" && details !== "No details" ? (
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
        backgroundColor: "#3F2D91",
        padding: 20,
        borderRadius: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        marginLeft: 10,
    },
    dateTextContainer: {
        marginLeft: 8,
        justifyContent: 'flex-start',
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
    addressContainer: {
        flexDirection: "row",
        justifyContent: "space-between", // Aligns the tags and location on the right
        alignItems: "center",
        marginTop: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
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
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    },
    passcodeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    passcodeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFD700",
        marginRight: 10,
    },
});

export default EventCard;