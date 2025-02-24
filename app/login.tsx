import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    Image,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Ensure the correct path
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function AuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle between login & signup
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async () => {
        if (!email || !password || (isSignUp && (!firstName || !lastName))) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            if (isSignUp) {
                // Sign Up: Create a new user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Update profile with first and last name
                await updateProfile(user, {
                    displayName: `${firstName} ${lastName}`,
                });

                Alert.alert("Success", "Account created! Please log in.");
                setIsSignUp(false); // Switch to login mode
            } else {
                // Login: Authenticate user
                await signInWithEmailAndPassword(auth, email, password);

                router.replace("/home"); // Navigate to home page
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const toggleSignUpLogin = () => {
        setIsSignUp(prevState => !prevState); // Use previous state to toggle without triggering re-render issues
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f5d']} style={styles.gradientContainer}>
                <View style={styles.container}>
                    <Image
                        source={require('@/assets/images/volleyball.png')} // Make sure to replace with your actual image file path
                        style={styles.image}
                    />

                    <Text style={styles.welcomeText}>Welcome to QuickCourt!</Text>

                    {isSignUp && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <Button title={isSignUp ? "Sign Up" : "Login"} onPress={handleAuth} />
                    <Text style={styles.toggleText} onPress={toggleSignUpLogin}>
                        {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                    </Text>
                </View>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    gradientContainer: { flex: 1 }, // Full screen container for gradient background
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    welcomeText: { fontSize: 32, fontWeight: "bold", marginBottom: 20, textAlign: 'center', color: 'white' },
    image: { width: 150, height: 150, marginBottom: 20 }, // Adjust the image size as needed
    input: {
        width: "100%",
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: 'white'
    },
    errorText: { color: "red", fontSize: 14, marginBottom: 10 },
    toggleText: {
        color: 'white',
        marginTop: 10,
        textDecorationLine: 'underline'
    },
});