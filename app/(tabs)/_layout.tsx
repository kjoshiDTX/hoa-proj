import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: 'Chatbot',
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                }}
            />
        </Tabs>
    );
}
