import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IndexPage() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track login state
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const userLoggedIn = await AsyncStorage.getItem("userLoggedIn");
                setIsLoggedIn(userLoggedIn === "true");
            } catch (error) {
                console.error("Failed to fetch login status", error);
            }
        };

        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        // Optionally, show a loading spinner or something else here while checking login status
        return null;
    }

    // If the user is logged in, redirect them to the home page
    if (isLoggedIn) {
        router.push("/home"); // Navigate to home page
    } else {
        router.push("/login"); // Navigate to login page
    }

    return null; // Rendering nothing as we're redirecting based on login status
}