import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Layout() {
    const [username, setUsername] = useState<string | null>(null); // Default null for loading state
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    // Function to fetch username from AsyncStorage
    const fetchUsername = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            console.log('Fetched username:', storedUsername); // Debugging log
            setUsername(storedUsername || 'Guest'); // Default to 'Guest' if no username
        } catch (error) {
            console.error('Error fetching username:', error);
            setUsername('Guest'); // Fallback in case of error
        } finally {
            setIsLoading(false); // Set loading to false once username is fetched
        }
    };

    // Fetch username whenever screen is focused (ensures updates after login/logout)
    useFocusEffect(
        React.useCallback(() => {
            fetchUsername();
        }, [])
    );

    return (
        <Stack
            screenOptions={{
                headerTitle: '', // Remove title
                headerBackVisible: false, // Remove back button
                headerRight: () => (
                    <View style={styles.headerRight}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#000" /> // Show spinner while loading
                        ) : (
                            <Text style={styles.greeting}>Hello, {username}</Text>
                        )}
                    </View>
                ),
            }}
        />
    );
}

const styles = StyleSheet.create({
    headerRight: {
        marginRight: 15,
    },
    greeting: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});