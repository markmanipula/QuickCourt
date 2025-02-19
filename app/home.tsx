import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage() {
    const router = useRouter();

    const handleLogout = async () => {
        // Clear login status
        await AsyncStorage.removeItem('userLoggedIn');
        router.push('/login'); // Navigate back to login page
    };

    return (
        <View>
            <Text>Hello, QuickCourt!</Text>
            <Button
                title="Create Event"
                onPress={() => router.push("/create-event")}
            />
            <Button
                title="View All Events"
                onPress={() => router.push("/events")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});