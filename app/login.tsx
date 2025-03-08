import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

export default function AuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAuth = async () => {
        if (!email || !password || (isSignUp && (!firstName || !lastName))) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: `${firstName} ${lastName}` });

                Alert.alert("Success", "Account created! Please log in.");
                setIsSignUp(false);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                router.replace("/home");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <LinearGradient colors={['#d4eaf7', '#a9d6eb', '#f5faff']} style={styles.gradientContainer}>
                        <View style={styles.container}>
                            <Image source={require('@/assets/images/volleyball.png')} style={styles.image} />
                            <Text style={styles.welcomeText}>Welcome to QuickCourt!</Text>

                            {isSignUp && (
                                <>
                                    <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                                    <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
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

                            {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

                            {loading ? (
                                <ActivityIndicator size="large" color="#ffcc00" />
                            ) : (
                                <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                                    <Text style={styles.authButtonText}>{isSignUp ? "Sign Up" : "Login"}</Text>
                                </TouchableOpacity>
                            )}

                            <Text style={styles.toggleText} onPress={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                            </Text>
                        </View>
                    </LinearGradient>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#2c2c2c",
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "white",
        fontSize: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    errorBox: {
        backgroundColor: "#ffcccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: "100%",
        alignItems: "center",
    },
    errorText: {
        color: "#d9534f",
        fontSize: 14,
    },
    authButton: {
        backgroundColor: "#e8cc54",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    authButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#192f5d",
    },
    toggleText: {
        color: "#2c2c2c",
        marginTop: 10,
        textDecorationLine: "underline",
    },
});