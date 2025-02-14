import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
}

export default function Button({ title, onPress, variant = "primary" }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, variant === "secondary" && styles.secondary]}
            onPress={onPress}
        >
            <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    secondary: {
        backgroundColor: "#E5E5E5",
    },
    text: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    secondaryText: {
        color: "#000",
    },
});