import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path

export default function HomePage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fullName = user.displayName || "User";
                const nameParts = fullName.split(" "); // Split name by space
                const firstName = nameParts[0];
                const lastNameInitial = nameParts[1] ? nameParts[1][0] : ""; // First letter of last name
                setUsername(`${firstName} ${lastNameInitial}.`); // Format as "First LastInitial."
            } else {
                router.replace("/login"); // Redirect to login if not logged in
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login"); // Redirect to login page
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to QuickCourt, {username}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Create Event" onPress={() => router.push("/create-event/create-event")} />
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