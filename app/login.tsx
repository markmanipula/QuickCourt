import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle between login & signup
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        if (!username || !password) {
            setError("Please fill in both fields");
            return;
        }

        try {
            if (isSignUp) {
                // Sign Up: Store user credentials
                await AsyncStorage.setItem(`user_${username}`, password);
                setError("Account created! Please log in.");
                setIsSignUp(false); // Switch to login mode
            } else {
                // Login: Validate credentials
                const storedPassword = await AsyncStorage.getItem(`user_${username}`);
                if (storedPassword === password) {
                    await AsyncStorage.setItem("username", username);
                    await AsyncStorage.setItem("userLoggedIn", "true");
                    setError(null);
                    router.replace("/home"); // Navigate to home
                } else {
                    setError("Invalid username or password");
                }
            }
        } catch (error) {
            setError("Error processing request");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isSignUp ? "Sign Up" : "Login"}</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button title={isSignUp ? "Sign Up" : "Login"} onPress={handleAuth} />
            <Text style={styles.toggleText} onPress={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { width: "100%", padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
    errorText: { color: "red", fontSize: 14, marginBottom: 10 },
    toggleText: { color: "blue", marginTop: 10, textDecorationLine: "underline" },
});