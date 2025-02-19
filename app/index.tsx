import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig"; // Ensure the correct path
import { onAuthStateChanged } from "firebase/auth";

export default function IndexPage() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track login state
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = () => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setIsLoggedIn(true); // User is logged in
                } else {
                    setIsLoggedIn(false); // No user, so not logged in
                }
            });

            return unsubscribe; // Cleanup the listener when component unmounts
        };

        const unsubscribe = checkLoginStatus();

        return () => unsubscribe(); // Cleanup the listener
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