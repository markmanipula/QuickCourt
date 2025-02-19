import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage() {
    const router = useRouter();

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userLoggedIn"); // Remove login data
        router.replace("/login"); // Redirect to login page
    };

    return (
        <View>
            <Text>Welcome to QuickCourt!</Text>
            <Button title="Create Event" onPress={() => router.push("/create-event")} />
            <Button title="View All Events" onPress={() => router.push("/events")} />
            <Button title="Logout" onPress={handleLogout} color="red" />
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