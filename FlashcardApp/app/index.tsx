
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';


export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Flashcard-App</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/create')}>
                    <Text style={styles.buttonText}>Create Deck</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/deck/123')}>
                    <Text style={styles.buttonText}>Deck details (example)</Text>
                </TouchableOpacity>
            </View>

            {/* Statische Decks */}
            <View style={styles.deckContainer}>
                {["Deck A", "Deck B", "Deck C"].map((deck, index) => (
                    <TouchableOpacity key={index} onPress={() => router.push('/deck/123')}>
                        <View style={[styles.deck, { backgroundColor: ['#333', '#444', '#555'][index] }]}>
                            <Text style={styles.deckText}>{deck}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#121212',
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
        position: 'absolute',
        top: 20,
    },
    buttonContainer: {
        marginTop: 80,
        width: '80%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#1E88E5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deckContainer: {
        marginTop: 30,
        width: '80%',
    },
    deck: {
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    deckText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});