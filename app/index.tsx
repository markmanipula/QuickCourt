import { View, Text } from "react-native";
import Button from "../components/Button";

export default function Page() {
    return (
        <View>
            <Text>Hello, QuickCourt!</Text>
            <Button title="Create Event" onPress={() => alert("Creating...")} />
            <Button title="Join Event" onPress={() => alert("Joining...")} />
        </View>
    );
}