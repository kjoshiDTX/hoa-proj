import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';
import Markdown from 'react-native-markdown-display';

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
        // Add user message
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        // Create placeholder for bot message
        setHistory(prev => [...prev, { role: 'bot', text: '' }]);

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

            if (!response.ok) throw new Error('Network response was not ok');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botResponse = '';
            let rawCitations: string[] = [];

            // Loop to read stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const data = JSON.parse(line);

                        if (data.type === 'citations') {
                            rawCitations = data.citations;
                        } else if (data.type === 'content') {
                            botResponse += data.chunk;
                            // Update last message (bot) with new content
                            setHistory(prev => {
                                const newHistory = [...prev];
                                const lastMsg = newHistory[newHistory.length - 1];
                                if (lastMsg.role === 'bot') {
                                    lastMsg.text = botResponse;
                                }
                                return newHistory;
                            });
                        } else if (data.type === 'error') {
                            botResponse += `\n[Error: ${data.message}]`;
                        }
                    } catch (e) {
                        console.error("Error parsing JSON chunk", e);
                    }
                }
            }

            // Append citations at the end
            if (rawCitations.length > 0) {
                const citationText = `\n\nSources:\n${rawCitations.join('\n')}`;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMsg = newHistory[newHistory.length - 1];
                    lastMsg.text += citationText;
                    return newHistory;
                });
            }

        } catch (error: any) {
            console.error(error);
            setHistory(prev => {
                // Check if we already have a bot placeholder to update, or need a new one
                const newHistory = [...prev];
                const lastMsg = newHistory[newHistory.length - 1];
                if (lastMsg.role === 'bot') {
                    lastMsg.text += `\nError: ${error.message}`;
                    return newHistory;
                } else {
                    return [...prev, { role: 'bot', text: `Error: ${error.message}` }];
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const renderItem: ListRenderItem<Message> = ({ item }) => (
        <View style={[styles.msg, item.role === 'user' ? styles.userMsg : styles.botMsg]}>
            {item.role === 'bot' ? (
                <Markdown style={markdownStyles}>
                    {item.text}
                </Markdown>
            ) : (
                <Text style={styles.userText}>{item.text}</Text>
            )}
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
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 8, marginRight: 10 },
    userText: { fontSize: 16 }
});

const markdownStyles = StyleSheet.create({
    body: { fontSize: 16, color: '#333' },
    heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
    strong: { fontWeight: 'bold' },
    paragraph: { marginBottom: 10 },
    bullet_list: { marginVertical: 5 },
});
