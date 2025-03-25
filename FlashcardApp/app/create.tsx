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
  ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { type Deck, type Card, DECK_COLORS } from "./types" // Importiere die Typen und Farben

export default function CreateDeckScreen() {
  const router = useRouter()
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(DECK_COLORS.blue) // Standard: Blau
  const [isLoading, setIsLoading] = useState(false)

  const createDeck = async () => {
    if (!deckName.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Namen für das Deck ein.")
      return
    }

    setIsLoading(true)
    try {
      // Bestehende Decks laden
      const storedDecksJson = await AsyncStorage.getItem("decks")
      const storedDecks: Deck[] = storedDecksJson ? JSON.parse(storedDecksJson) : []

      // Neue Deck-ID generieren
      const deckId = Date.now().toString()

      // Vordefinierte Karten erstellen
      const defaultCards: Card[] = [
        {
          id: `${deckId}-card-1`,
          deckId: deckId,
          front: "Was ist React Native?",
          back: "Ein Framework zur App-Entwicklung mit JavaScript.",
          createdAt: new Date().toISOString(),
        },
        {
          id: `${deckId}-card-2`,
          deckId: deckId,
          front: "Was macht useState?",
          back: "Es speichert lokale Zustände in einer Komponente.",
          createdAt: new Date().toISOString(),
        },
        {
          id: `${deckId}-card-3`,
          deckId: deckId,
          front: "Wofür ist AsyncStorage?",
          back: "Zum Speichern von Daten lokal auf dem Gerät.",
          createdAt: new Date().toISOString(),
        },
      ]

      // Neues Deck erstellen mit vordefinierten Cards und ausgewählter Farbe
      const newDeck: Deck = {
        id: deckId,
        name: deckName.trim(),
        description: deckDescription.trim(),
        color: selectedColor, // Speichere die ausgewählte Farbe
        cards: defaultCards,
        createdAt: new Date().toISOString(),
      }

      // Deck zur Liste hinzufügen und speichern
      const updatedDecks = [...storedDecks, newDeck]
      await AsyncStorage.setItem("decks", JSON.stringify(updatedDecks))

      Alert.alert("Erfolg", "Deck wurde erfolgreich erstellt!", [{ text: "OK", onPress: () => router.push("/") }])
    } catch (error) {
      console.error("Fehler beim Erstellen des Decks:", error)
      Alert.alert("Fehler", "Das Deck konnte nicht erstellt werden.")
    } finally {
      setIsLoading(false)
    }
  }

  // Rendere einen Farbkreis
  const renderColorCircle = (color: string) => (
    <TouchableOpacity
      key={color}
      style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.selectedColorCircle]}
      onPress={() => setSelectedColor(color)}
    >
      {selectedColor === color && <View style={styles.colorCircleCheckmark} />}
    </TouchableOpacity>
  )

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Farbe auswählen</Text>
            <View style={styles.colorPickerContainer}>
              {Object.values(DECK_COLORS).map((color) => renderColorCircle(color))}
            </View>
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
              style={[
                styles.button,
                styles.createButton,
                { backgroundColor: selectedColor },
                isLoading && styles.disabledButton,
              ]}
              onPress={createDeck}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{isLoading ? "Wird erstellt..." : "Deck erstellen"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flexGrow: 1,
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
  colorPickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  colorCircleCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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

