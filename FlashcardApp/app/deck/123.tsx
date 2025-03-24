import React from 'react';
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';

export default function DeckDetailScreen() {
  const { deckId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Deck Detail: {deckId}</Text>
    <Button 
            title="Back to Index" 
            onPress={() => router.push('/')} // Gehe zur Root-Route oder Hauptseite
          />
    </View>

    
  );
}