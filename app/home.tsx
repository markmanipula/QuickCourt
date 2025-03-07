import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert
} from "react-native";
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
                const fullName = user.displayName?.trim() || "Player";
                const nameParts = fullName.split(" ");
                const firstName = nameParts[0];
                const lastNameInitial = nameParts.length > 1 ? nameParts[1][0] : "";
                setUsername(lastNameInitial ? `${firstName} ${lastNameInitial}.` : firstName);
            } else {
                router.replace("/login");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            router.replace("/login");
                        } catch (error) {
                            alert("Logout Failed. Something went wrong. Please try again.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <LinearGradient colors={['#d4eaf7', '#a9d6eb', '#f5faff']} style={styles.container}>
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
        color: "#2c2c2c",
        textAlign: "center",
    },
    subHeader: {
        fontSize: 18,
        color: "#2c2c2c",
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