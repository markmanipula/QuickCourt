import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path

export default function AuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle between login & signup
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        if (!email || !password) {
            setError("Please fill in both fields");
            return;
        }

        try {
            if (isSignUp) {
                // Sign Up: Create a new user
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert("Success", "Account created! Please log in.");
                setIsSignUp(false); // Switch to login mode
            } else {
                // Login: Authenticate user
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Optional: Store user information if needed
                // AsyncStorage.setItem("username", user.displayName || user.email);

                router.replace("/home"); // Navigate to home page
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isSignUp ? "Sign Up" : "Login"}</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
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