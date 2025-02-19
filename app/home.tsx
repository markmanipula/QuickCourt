import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomePage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = await AsyncStorage.getItem("username");
            if (!storedUser) {
                router.replace("/login"); // Redirect to login if not logged in
            } else {
                setUsername(storedUser);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("username"); // Clear stored user
        await AsyncStorage.removeItem("token"); // Clear stored token
        router.replace("/login"); // Redirect to login page
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to QuickCourt, {username}!</Text>
            <View style={styles.buttonContainer}>
                <Button title="Create Event" onPress={() => router.push("/create-event")} />
                <Button title="View All Events" onPress={() => router.push("/events")} />
                <Button title="Logout" onPress={handleLogout} color="red" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonContainer: {
        width: "80%",
        gap: 10, // Spacing between buttons
    },
});