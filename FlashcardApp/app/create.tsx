"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function CreateDeckScreen() {
  const router = useRouter()
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createDeck = async () => {
    if (!deckName.trim()) {
      Alert.alert("Bitte gib einen Namen für das Deck ein.")
      return
    }

    setIsLoading(true)
    try {
     
      const storedDecksJson = await AsyncStorage.getItem("decks")
      const storedDecks = storedDecksJson ? JSON.parse(storedDecksJson) : []

    
      const newDeck = {
        id: Date.now().toString(), 
        name: deckName.trim(),
        description: deckDescription.trim(),
        cards: [],
        createdAt: new Date().toISOString(),
      }

      
      const updatedDecks = [...storedDecks, newDeck]
      await AsyncStorage.setItem("decks", JSON.stringify(updatedDecks))

      Alert.alert("Deck wurde erfolgreich erstellt!", [{ text: "OK", onPress: () => router.push("/") }])
    } catch (error) {
      console.error("Fehler beim Erstellen des Decks:", error)
      Alert.alert("Fehler", "Das Deck konnte nicht erstellt werden.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Neues Deck erstellen</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name des Decks</Text>
          <TextInput
            style={styles.input}
            value={deckName}
            onChangeText={setDeckName}
            placeholder="z.B. Spanisch Vokabeln"
            placeholderTextColor="#666"
            maxLength={50}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Beschreibung (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={deckDescription}
            onChangeText={setDeckDescription}
            placeholder="Kurze Beschreibung des Decks..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.push("/")}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Abbrechen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.createButton, isLoading && styles.disabledButton]}
            onPress={createDeck}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? "Wird erstellt..." : "Deck erstellen"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 15,
    color: "#ffffff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#444",
    marginRight: 10,
  },
  createButton: {
    backgroundColor: "#1E88E5",
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

