import { View, Text, StyleSheet } from "react-native";

export default function Page() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello, QuickCourt!!</Text>
            <Text style={styles.subtitle}>Welcome to your first page.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 18,
        color: "#666",
    },
});