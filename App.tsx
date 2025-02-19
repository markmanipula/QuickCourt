import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track login state
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
                setIsLoggedIn(userLoggedIn === 'true');
            } catch (error) {
                console.error('Failed to fetch login status', error);
            }
        };

        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        // Optionally show a loading spinner while checking login status
        return null;
    }

    return isLoggedIn ? (
        router.push('/home') // Redirect to home if logged in
    ) : (
        router.push('/login') // Otherwise, show login page
    );
}