import { View, Text, StyleSheet, Button, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useState, useEffect } from 'react';

export default function SettingsScreen() {
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('');

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            const file = result.assets[0];
            uploadFile(file);

        } catch (err) {
            console.log('Error picking document:', err);
        }
    };

    // Fetch docs on load
    const [documents, setDocuments] = useState<string[]>([]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/documents');
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (e) {
            console.error("Failed to fetch docs", e);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [uploading]); // Refetch after upload

    const deleteDocument = async (filename: string) => {
        try {
            await fetch(`http://localhost:8000/api/documents/${filename}`, { method: 'DELETE' });
            Alert.alert("Deleted", filename);
            fetchDocuments();
        } catch (e) {
            Alert.alert("Error", "Failed to delete");
        }
    };

    const uploadFile = async (file: any) => {
        setUploading(true);
        setStatus('Uploading...');

        const formData = new FormData();

        if (Platform.OS === 'web' && file.file) {
            // Web: Append the raw File object directly
            formData.append('file', file.file);
        } else {
            // Native: Append the specific object structure required by RN
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf',
            } as any);
        }

        try {
            const response = await fetch('http://localhost:8000/api/ingest', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus(`Success: Processed ${data.chunks_processed} chunks.`);
                if (Platform.OS !== 'web') Alert.alert('Success', `Ingested ${file.name}`);
                fetchDocuments(); // Refresh list
            } else {
                setStatus('Upload failed.');
                console.error(data);
            }
        } catch (error) {
            setStatus('Error connecting to server.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Data Management</Text>

            <View style={styles.card}>
                <Text style={styles.subtitle}>Ingest Rulebook (PDF)</Text>
                <Text style={styles.desc}>Upload a new HOA rulebook to add to the knowledge base.</Text>

                <Button
                    title={uploading ? "Uploading..." : "Select PDF"}
                    onPress={pickDocument}
                    disabled={uploading}
                />

                {status ? <Text style={styles.status}>{status}</Text> : null}
            </View>

            <View style={[styles.card, { marginTop: 20 }]}>
                <Text style={styles.subtitle}>Knowledge Base</Text>
                {documents.map((doc, idx) => (
                    <View key={idx} style={styles.row}>
                        <Text style={styles.docName}>{doc}</Text>
                        <Button title="Delete" onPress={() => deleteDocument(doc)} color="red" />
                    </View>
                ))}
                {documents.length === 0 && <Text style={styles.desc}>No documents uploaded.</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
    subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
    desc: { color: '#666', marginBottom: 10 },
    status: { marginTop: 10, alignSelf: 'center', color: 'blue' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    docName: { flex: 1, fontWeight: '500' }
});
