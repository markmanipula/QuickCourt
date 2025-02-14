import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import EventScreen from '../screens/EventScreen';

type RootStackParamList = {
    Home: undefined;
    Event: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Event" component={EventScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;