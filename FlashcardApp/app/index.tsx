"use client"

import { useState, useCallback } from "react"
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useFocusEffect } from "expo-router"
import { Trash2 } from "lucide-react-native"
import { type Deck, DECK_COLORS } from "./types" // Importiere die Typen

export default function HomeScreen() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Diese Funktion wird jedes Mal aufgerufen, wenn der Bildschirm fokussiert wird
  useFocusEffect(
    useCallback(() => {
      loadDecks()
    }, []),
  )

  const loadDecks = async () => {
    setIsLoading(true)
    try {
      const storedDecks = await AsyncStorage.getItem("decks")
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks))
      } else {
        setDecks([])
      }
    } catch (error) {
      console.error("Fehler beim Laden der Decks:", error)
      Alert.alert("Fehler", "Die Decks konnten nicht geladen werden.")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDeck = async (deckId: string) => {
    try {
      // Bestätigung vor dem Löschen
      Alert.alert("Deck löschen", "Möchtest du dieses Deck wirklich löschen?", [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            const updatedDecks = decks.filter((deck) => deck.id !== deckId)
            await AsyncStorage.setItem("decks", JSON.stringify(updatedDecks))
            setDecks(updatedDecks)
          },
        },
      ])
    } catch (error) {
      console.error("Fehler beim Löschen des Decks:", error)
      Alert.alert("Fehler", "Das Deck konnte nicht gelöscht werden.")
    }
  }

  const renderDeckItem = ({ item }: { item: Deck }) => (
    <TouchableOpacity style={styles.deckWrapper} onPress={() => router.push(`/deck/${item.id}`)}>
      <View style={[styles.deck, { borderLeftWidth: 5, borderLeftColor: item.color || DECK_COLORS.blue }]}>
        <Text style={styles.deckText}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.deckDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.cardCount}>{item.cards?.length || 0} Karten</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDeck(item.id)}>
        <Trash2 size={18} color="#ff4d4d" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard-App</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/create")}>
          <Text style={styles.buttonText}>Neues Deck erstellen</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Lade Decks...</Text>
      ) : decks.length > 0 ? (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeckItem}
          contentContainerStyle={styles.deckContainer}
          numColumns={1}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Keine Decks vorhanden. Erstelle dein erstes Deck!</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  deckContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  deckWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  deck: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 20,
    minHeight: 100,
    overflow: "hidden",
  },
  deckText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  deckDescription: {
    fontSize: 14,
    color: "#aaaaaa",
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 12,
    color: "#888888",
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
  },
})

