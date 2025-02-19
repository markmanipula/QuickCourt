import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("username");
            if (storedUser) setUser(storedUser);
        };
        loadUser();
    }, []);

    const login = async (username: string, token: string) => {
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("token", token);
        setUser(username);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("username");
        await AsyncStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};