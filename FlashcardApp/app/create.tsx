import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router/'; // useRouter statt router direkt

export default function CreateDeckScreen() {
  const router = useRouter(); // Den Router-Objekt durch den Hook erhalten

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Deck erstellen</Text>
      <Button 
        title="Back to Index" 
        onPress={() => router.push('/')} // Gehe zur Root-Route oder Hauptseite
      />  
    </View>
  );
}
