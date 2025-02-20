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

    useEffect(() => {
        // Delay the navigation after state is set, to avoid triggering during render
        if (isLoggedIn === null) {
            return; // If the login status is still unknown, don't navigate yet
        }

        if (isLoggedIn) {
            router.push("/home"); // Navigate to home page
        } else {
            router.push("/login"); // Navigate to login page
        }
    }, [isLoggedIn, router]);

    // Optionally, you can return a loading screen here while the login state is being checked
    return null; // Rendering nothing as we're redirecting based on login status
}