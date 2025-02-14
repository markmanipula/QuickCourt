import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Event: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View>
            <Text>Welcome to QuickCourt!</Text>
            <Button title="Go to Event" onPress={() => navigation.navigate('Event')} />
        </View>
    );
};

export default HomeScreen;