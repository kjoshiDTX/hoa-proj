import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';

interface Message {
    role: string;
    text: string;
}

export default function ChatbotScreen() {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg = message;
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'test-session',
                    message: userMsg
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API errors gracefully
                throw new Error(data.detail || 'Server error');
            }

            const citations = data.citations || [];
            const citationText = citations.length > 0
                ? `\n\nSources:\n${citations.join('\n')}`
                : '';

            setHistory(prev => [...prev, {
                role: 'bot',
                text: data.answer + citationText
            }]);

        } catch (error: any) {
            console.error(error);
            setHistory(prev => [...prev, { role: 'bot', text: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem: ListRenderItem<Message> = ({ item }) => (
        <View style={[styles.msg, item.role === 'user' ? styles.userMsg : styles.botMsg]}>
            <Text>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Ask a question..."
                />
                <Button title={loading ? "..." : "Send"} onPress={sendMessage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    msg: { padding: 10, marginVertical: 5, borderRadius: 8, maxWidth: '80%' },
    userMsg: { alignSelf: 'flex-end', backgroundColor: '#e1f5fe' },
    botMsg: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 8, marginRight: 10 }
});
