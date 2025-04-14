"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Deck, Card } from "../types"
import styles from "../styles"
import ColorPicker from "react-native-wheel-color-picker"

// Function to generate a random color from predefined list
function getRandomColor(): string {
  const colors = ['#FFD700', '#90EE90', '#87CEFA', '#FFB6C1', '#FFA07A']; // Yellow, Green, Blue, Pink, Orange
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export default function CreateDeckScreen() {
  const router = useRouter()
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(getRandomColor()) // Initialize with a random color
  const [isLoading, setIsLoading] = useState(false)
  const pickerRef = useRef(null)

  const onColorChangeComplete = (color) => {
    setSelectedColor(color)
  }

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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Neues Deck erstellen</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={deckName}
              onChangeText={setDeckName}
              placeholder="Name des Decks"
              placeholderTextColor="#666"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={deckDescription}
              onChangeText={setDeckDescription}
              placeholder="Kurze Beschreibung des Decks...(optional)"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                ref={pickerRef}
                color={selectedColor}
                onColorChangeComplete={onColorChangeComplete}
                thumbSize={40}
                sliderSize={40}
                noSnap={true}
                row={false}
                swatchesLast={true}
                swatches={true}
                discrete={false}
                wheelLodingIndicator={<ActivityIndicator size={40} />}
                sliderLodingIndicator={<ActivityIndicator size={20} />}
                useNativeDriver={false}
                useNativeLayout={false}
              />
              <View style={styles.colorPreviewContainer}>
                <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
                <Text style={styles.colorHexText}>{selectedColor.toUpperCase()}</Text>
              </View>
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
    </KeyboardAvoidingView>
  )
}