"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ArrowLeft, Plus } from "lucide-react-native"
import { type Deck, type DeckParams, DECK_COLORS } from "../types" // Importiere die Typen

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<DeckParams>()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDeck()
  }, [id])

  const loadDeck = async () => {
    setIsLoading(true)
    try {
      const storedDecks = await AsyncStorage.getItem("decks")
      if (storedDecks) {
        const decks: Deck[] = JSON.parse(storedDecks)
        const foundDeck = decks.find((d) => d.id === id)
        if (foundDeck) {
          setDeck(foundDeck)
        } else {
          Alert.alert("Fehler", "Deck nicht gefunden", [{ text: "Zurück", onPress: () => router.push("/") }])
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden des Decks:", error)
      Alert.alert("Fehler", "Das Deck konnte nicht geladen werden.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Lade Deck...</Text>
      </View>
    )
  }

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Das Deck wurde leider nicht gefunden</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Zurück zur Übersicht</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: deck.color || DECK_COLORS.blue }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{deck.name}</Text>
      </View>

      {deck.description ? (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{deck.description}</Text>
        </View>
      ) : null}

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{deck.cards?.length || 0} Karten in diesem Deck</Text>
      </View>

      {/* Die Karten werden hier noch nicht angezeigt, aber die Daten sind bereits vorhanden */}
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Dieses Deck enthält {deck.cards?.length || 0} Karten. Die Anzeige der Karten wird in Tag 3 implementiert.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: deck.color || DECK_COLORS.blue }]}
        onPress={() => {
          Alert.alert("Info", "Funktion zum Hinzufügen von Karten wird in Tag 3 implementiert.")
        }}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 3,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  descriptionText: {
    fontSize: 16,
    color: "#cccccc",
  },
  statsContainer: {
    padding: 15,
    backgroundColor: "#222",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  statsText: {
    fontSize: 14,
    color: "#888888",
  },
  cardsList: {
    padding: 15,
  },
  cardItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  cardFront: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  cardBack: {
    fontSize: 16,
    color: "#aaaaaa",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

