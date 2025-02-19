import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Set the display name (username)
            await updateProfile(user, { displayName: username });

            Alert.alert("Success", "Signup successful! Please log in.");
        } catch (error: any) {
            Alert.alert("Signup Failed", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button title="Sign Up" onPress={handleSignup} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});