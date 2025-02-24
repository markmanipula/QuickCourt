import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const fullName = user.displayName || "Player";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";
                setUsername(`${firstName} ${lastNameInitial}.`);
            } else {
                router.replace("/login");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    return (
        <LinearGradient colors={["#ff9800", "#ff5722"]} style={styles.container}>
            <SafeAreaView style={styles.safeContainer}>
                <Image source={require("@/assets/images/volleyball.png")} style={styles.logo} />
                <Text style={styles.header}>Welcome, {username}!</Text>
                <Text style={styles.subHeader}>Let’s hit the court and play!</Text>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/create-event/create-event")}>
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Create Event</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/events")}>
                    <Ionicons name="calendar" size={24} color="#fff" />
                    <Text style={styles.buttonText}>View All Events</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                    <Ionicons name="log-out" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    safeContainer: {
        width: "90%",
        alignItems: "center",
        paddingVertical: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    subHeader: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 30,
        textAlign: "center",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e88e5",
        width: "100%",
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    logoutButton: {
        backgroundColor: "#d32f2f",
    }
});
