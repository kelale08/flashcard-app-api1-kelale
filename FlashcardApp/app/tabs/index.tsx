"use client"

import { useState, useCallback, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useFocusEffect } from "expo-router"
import { Trash2, Edit, Plus, X, ChevronRight, Save, MoreVertical } from "lucide-react-native"
import { type Deck, type Card, DECK_COLORS } from "../types"
import styles from "../styles"
import ColorPicker from "react-native-wheel-color-picker"

export default function HomeScreen() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [isCardModalVisible, setIsCardModalVisible] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [cardFront, setCardFront] = useState("")
  const [cardBack, setCardBack] = useState("")
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false)
  const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 })
  const [longPressedDeck, setLongPressedDeck] = useState<Deck | null>(null)
  const [isEditDeckModalVisible, setIsEditDeckModalVisible] = useState(false)
  const [editDeckName, setEditDeckName] = useState("")
  const [editDeckDescription, setEditDeckDescription] = useState("")
  const [editDeckColor, setEditDeckColor] = useState("")

  const actionMenuAnimation = useRef(new Animated.Value(0)).current

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
            hideActionMenu()
          },
        },
      ])
    } catch (error) {
      console.error("Fehler beim Löschen des Decks:", error)
      Alert.alert("Fehler", "Das Deck konnte nicht gelöscht werden.")
    }
  }

  const handleLongPress = (deck: Deck, event: any) => {
    // Get the position of the long press
    const { pageX, pageY } = event.nativeEvent

    // Set the position for the action menu
    setActionMenuPosition({
      x: pageX,
      y: pageY,
    })

    // Set the long pressed deck
    setLongPressedDeck(deck)

    // Show the action menu with animation
    setIsActionMenuVisible(true)
    Animated.spring(actionMenuAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start()
  }

  const hideActionMenu = () => {
    Animated.timing(actionMenuAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsActionMenuVisible(false)
      setLongPressedDeck(null)
    })
  }

  const handleEditDeck = () => {
    if (longPressedDeck) {
      setEditDeckName(longPressedDeck.name)
      setEditDeckDescription(longPressedDeck.description || "")
      setEditDeckColor(longPressedDeck.color)
      setIsEditDeckModalVisible(true)
      hideActionMenu()
    }
  }

  const saveDeckChanges = async () => {
    if (!longPressedDeck) return

    try {
      const updatedDecks = decks.map((deck) => {
        if (deck.id === longPressedDeck.id) {
          return {
            ...deck,
            name: editDeckName,
            description: editDeckDescription,
            color: editDeckColor,
          }
        }
        return deck
      })

      await AsyncStorage.setItem("decks", JSON.stringify(updatedDecks))
      setDecks(updatedDecks)
      setIsEditDeckModalVisible(false)
    } catch (error) {
      console.error("Fehler beim Speichern der Änderungen:", error)
      Alert.alert("Fehler", "Die Änderungen konnten nicht gespeichert werden.")
    }
  }

  const showCardModal = (deck: Deck) => {
    setSelectedDeck(deck)
    setIsCardModalVisible(true)
  }

  const startEditingCard = (card: Card) => {
    setEditingCard(card)
    setCardFront(card.front)
    setCardBack(card.back)
  }

  const startAddingCard = () => {
    if (!selectedDeck) return

    const newCard: Card = {
      id: `${selectedDeck.id}-card-${Date.now()}`,
      deckId: selectedDeck.id,
      front: "",
      back: "",
      createdAt: new Date().toISOString(),
    }

    setEditingCard(newCard)
    setCardFront("")
    setCardBack("")
  }

  const saveCardChanges = async () => {
    if (!selectedDeck || !editingCard) return

    try {
      let updatedDecks

      if (selectedDeck.cards.some((card) => card.id === editingCard.id)) {
        // Editing existing card
        updatedDecks = decks.map((deck) => {
          if (deck.id === selectedDeck.id) {
            return {
              ...deck,
              cards: deck.cards.map((card) => {
                if (card.id === editingCard.id) {
                  return {
                    ...card,
                    front: cardFront,
                    back: cardBack,
                  }
                }
                return card
              }),
            }
          }
          return deck
        })
      } else {
        // Adding new card
        updatedDecks = decks.map((deck) => {
          if (deck.id === selectedDeck.id) {
            return {
              ...deck,
              cards: [
                ...deck.cards,
                {
                  ...editingCard,
                  front: cardFront,
                  back: cardBack,
                },
              ],
            }
          }
          return deck
        })
      }

      await AsyncStorage.setItem("decks", JSON.stringify(updatedDecks))
      setDecks(updatedDecks)
      setEditingCard(null)

      // Update the selected deck
      const updatedSelectedDeck = updatedDecks.find((deck) => deck.id === selectedDeck.id)
      if (updatedSelectedDeck) {
        setSelectedDeck(updatedSelectedDeck)
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Karte:", error)
      Alert.alert("Fehler", "Die Karte konnte nicht gespeichert werden.")
    }
  }

  const deleteCard = async (cardId: string) => {
    if (!selectedDeck) return

    try {
      Alert.alert("Karte löschen", "Möchtest du diese Karte wirklich löschen?", [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            const updatedDecks = decks.map((deck) => {
              if (deck.id === selectedDeck.id) {
                return {
                  ...deck,
                  cards: deck.cards.filter((card) => card.id !== cardId),
                }
              }
              return deck
            })

            await AsyncStorage.setItem("decks", JSON.stringify(updatedDecks))
            setDecks(updatedDecks)

            // Update the selected deck
            const updatedSelectedDeck = updatedDecks.find((deck) => deck.id === selectedDeck.id)
            if (updatedSelectedDeck) {
              setSelectedDeck(updatedSelectedDeck)
            }
          },
        },
      ])
    } catch (error) {
      console.error("Fehler beim Löschen der Karte:", error)
      Alert.alert("Fehler", "Die Karte konnte nicht gelöscht werden.")
    }
  }

  const renderDeckItem = ({ item }: { item: Deck }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity
        style={styles.gridDeckWrapper}
        onPress={() => showCardModal(item)}
        onLongPress={(event) => handleLongPress(item, event)}
        delayLongPress={500}
      >
        <View style={styles.colorBand} backgroundColor={item.color || DECK_COLORS.blue} />
        <View style={styles.gridDeckContent}>
          <Text style={styles.deckText} numberOfLines={1}>
            {item.name}
          </Text>
          {item.description ? (
            <Text style={styles.deckDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.cardCount}>{item.cards?.length || 0} Karten</Text>

          <TouchableOpacity
            style={styles.gridMoreButton}
            onPress={(event) => handleLongPress(item, event)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={16} color="#aaaaaa" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  )

  const CardItem = ({
    card,
    startEditingCard,
    deleteCard,
  }: { card: Card; startEditingCard: (card: Card) => void; deleteCard: (cardId: string) => void }) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const flipAnim = useRef(new Animated.Value(0)).current

    const flipCard = () => {
      setIsFlipped(!isFlipped)
      Animated.spring(flipAnim, {
        toValue: isFlipped ? 0 : 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start()
    }

    const frontInterpolate = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    })

    const backInterpolate = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["180deg", "360deg"],
    })

    const frontAnimatedStyle = {
      transform: [{ rotateY: frontInterpolate }],
      backfaceVisibility: "hidden" as const,
    }

    const backAnimatedStyle = {
      transform: [{ rotateY: backInterpolate }],
      backfaceVisibility: "hidden" as const,
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }

    return (
      <View style={styles.cardItem}>
        <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={styles.flipCardContainer}>
          <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardSideLabel}>Vorderseite:</Text>
              <Text style={styles.cardText}>{card.front}</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.flipCard, backAnimatedStyle]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardSideLabel}>Rückseite:</Text>
              <Text style={styles.cardText}>{card.back}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.cardActionButton} onPress={() => startEditingCard(card)}>
            <Edit size={16} color="#ffffff" />
            <Text style={styles.cardActionText}>Bearbeiten</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cardActionButton, styles.cardDeleteButton]}
            onPress={() => deleteCard(card.id)}
          >
            <Trash2 size={16} color="#ff4d4d" />
            <Text style={[styles.cardActionText, styles.cardDeleteText]}>Löschen</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard-App</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/tabs/create")}>
          <Text style={styles.buttonText}>+ Neues Deck erstellen</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Lade Decks...</Text>
      ) : decks.length > 0 ? (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeckItem}
          contentContainerStyle={styles.gridContainer}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Keine Decks vorhanden. Erstelle dein erstes Deck!</Text>
        </View>
      )}

      {/* Action Menu for Long Press */}
      {isActionMenuVisible && longPressedDeck && (
        <TouchableWithoutFeedback onPress={hideActionMenu}>
          <View style={styles.actionMenuOverlay}>
            <Animated.View
              style={[
                styles.actionMenu,
                {
                  transform: [
                    { scale: actionMenuAnimation },
                    {
                      translateY: actionMenuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                  opacity: actionMenuAnimation,
                  top: actionMenuPosition.y - 100,
                  left: actionMenuPosition.x - 100,
                },
              ]}
            >
              <TouchableOpacity style={styles.actionMenuItem} onPress={handleEditDeck}>
                <Edit size={18} color="#ffffff" />
                <Text style={styles.actionMenuText}>Deck bearbeiten</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionMenuItem} onPress={() => showCardModal(longPressedDeck)}>
                <ChevronRight size={18} color="#ffffff" />
                <Text style={styles.actionMenuText}>Karten anzeigen</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionMenuItem, styles.actionMenuItemDelete]}
                onPress={() => deleteDeck(longPressedDeck.id)}
              >
                <Trash2 size={18} color="#ff4d4d" />
                <Text style={[styles.actionMenuText, styles.actionMenuTextDelete]}>Deck löschen</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Edit Deck Modal */}
      <Modal
        visible={isEditDeckModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditDeckModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.editDeckModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deck bearbeiten</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsEditDeckModalVisible(false)}>
                <X size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.compactRow}>
                {/* Left column - Text inputs */}
                <View style={styles.compactColumn}>
                  <View style={styles.compactInputGroup}>
                    <Text style={styles.compactLabel}>Name des Decks</Text>
                    <TextInput
                      style={styles.compactInput}
                      value={editDeckName}
                      onChangeText={setEditDeckName}
                      placeholder="z.B. Spanisch Vokabeln"
                      placeholderTextColor="#666"
                      maxLength={50}
                    />
                  </View>

                  <View style={styles.compactInputGroup}>
                    <Text style={styles.compactLabel}>Beschreibung</Text>
                    <TextInput
                      style={[styles.compactInput, styles.compactTextArea]}
                      value={editDeckDescription}
                      onChangeText={setEditDeckDescription}
                      placeholder="Kurze Beschreibung..."
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={3}
                      maxLength={200}
                    />
                  </View>
                </View>

                {/* Right column - Color picker */}
                <View style={styles.compactColumn}>
                  <Text style={styles.compactLabel}>Farbe</Text>
                  <View style={styles.compactColorPickerContainer}>
                    <ColorPicker
                      color={editDeckColor}
                      onColorChangeComplete={(color) => setEditDeckColor(color)}
                      thumbSize={25}
                      sliderSize={25}
                      noSnap={true}
                      row={false}
                      swatchesLast={false}
                      swatches={false}
                      discrete={false}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Color preview and buttons in a row */}
            <View style={styles.modalFooter}>
              <View style={styles.compactPreviewAndButtons}>
                <View style={[styles.colorPreview, { backgroundColor: editDeckColor }]} />

                <View style={styles.compactButtonGroup}>
                  <TouchableOpacity
                    style={[styles.compactButton, styles.cancelButton]}
                    onPress={() => setIsEditDeckModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Abbrechen</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.compactButton, styles.saveButton, { backgroundColor: editDeckColor }]}
                    onPress={saveDeckChanges}
                  >
                    <Text style={styles.buttonText}>Speichern</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cards Modal */}
      <Modal
        visible={isCardModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setIsCardModalVisible(false)
          setSelectedDeck(null)
          setEditingCard(null)
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!editingCard ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedDeck?.name} - Karten</Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setIsCardModalVisible(false)
                      setSelectedDeck(null)
                    }}
                  >
                    <X size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {selectedDeck?.cards.length === 0 ? (
                    <Text style={styles.emptyText}>Keine Karten vorhanden. Füge eine neue Karte hinzu!</Text>
                  ) : (
                    selectedDeck?.cards.map((card) => (
                      <CardItem key={card.id} card={card} startEditingCard={startEditingCard} deleteCard={deleteCard} />
                    ))
                  )}
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity style={[styles.button, styles.addButton]} onPress={startAddingCard}>
                    <Plus size={18} color="#ffffff" />
                    <Text style={styles.buttonText}>Neue Karte</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedDeck?.cards.some((card) => card.id === editingCard.id) ? "Karte bearbeiten" : "Neue Karte"}
                  </Text>
                  <TouchableOpacity style={styles.modalCloseButton} onPress={() => setEditingCard(null)}>
                    <X size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vorderseite</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={cardFront}
                      onChangeText={setCardFront}
                      placeholder="Vorderseite der Karte"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Rückseite</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={cardBack}
                      onChangeText={setCardBack}
                      placeholder="Rückseite der Karte"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, styles.modalButton]}
                    onPress={() => setEditingCard(null)}
                  >
                    <Text style={styles.buttonText}>Abbrechen</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, styles.modalButton]}
                    onPress={saveCardChanges}
                  >
                    <Save size={18} color="#ffffff" />
                    <Text style={styles.buttonText}>Speichern</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

