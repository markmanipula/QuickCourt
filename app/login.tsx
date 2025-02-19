import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please fill in both fields');
            return;
        }

        try {
            await AsyncStorage.setItem('username', username); // Store username
            await AsyncStorage.setItem('userLoggedIn', 'true'); // Store login status
            console.log('Stored username:', username); // Debug log
            setError(null);
            router.replace('/home'); // Navigate to home
        } catch (error) {
            setError('Failed to store login status');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    errorText: { color: 'red', fontSize: 14, marginBottom: 10 },
});