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
import { Trash2, Edit, Plus, X, ChevronRight, Save, MoreVertical, HelpCircle, FileQuestion } from "lucide-react-native"
import { type Deck, DECK_COLORS } from "../types"
import styles from "../styles"
import ColorPicker from "react-native-wheel-color-picker"

// Define the new card types
interface BaseCard {
  id: string
  deckId?: string
  createdAt?: string
  lastReviewed?: string
  type: "card" | "quiz"
}

interface StandardCard extends BaseCard {
  type: "card"
  question: string
  answer: string
}

interface QuizCard extends BaseCard {
  type: "quiz"
  question: string
  options: string[]
  correctAnswerIndex: number
}

// Union type for all card types
type FlashCard = StandardCard | QuizCard

// Extended Deck type to support both card types
interface ExtendedDeck extends Omit<Deck, "cards"> {
  cards: FlashCard[]
}

export default function HomeScreen() {
  const [decks, setDecks] = useState<ExtendedDeck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeck, setSelectedDeck] = useState<ExtendedDeck | null>(null)
  const [isCardModalVisible, setIsCardModalVisible] = useState(false)
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null)
  const [cardQuestion, setCardQuestion] = useState("")
  const [cardAnswer, setCardAnswer] = useState("")
  const [cardOptions, setCardOptions] = useState<string[]>(["", "", "", ""])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0)
  const [cardType, setCardType] = useState<"card" | "quiz">("card")
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false)
  const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 })
  const [longPressedDeck, setLongPressedDeck] = useState<ExtendedDeck | null>(null)
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
        // Convert existing decks to the new format if needed
        const parsedDecks = JSON.parse(storedDecks)
        const convertedDecks = parsedDecks.map((deck: Deck) => {
          // Convert old cards format to new format if needed
          const convertedCards = deck.cards.map((card: any) => {
            if (card.type) {
              // Card already has a type, return as is
              return card
            } else if (card.front && card.back) {
              // Old format card, convert to new format
              return {
                id: card.id,
                type: "card",
                question: card.front,
                answer: card.back,
                deckId: card.deckId,
                createdAt: card.createdAt,
                lastReviewed: card.lastReviewed,
              }
            }
            return card
          })

          return {
            ...deck,
            cards: convertedCards,
          }
        })

        setDecks(convertedDecks)
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

  const handleLongPress = (deck: ExtendedDeck, event: any) => {
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

  const showCardModal = (deck: ExtendedDeck) => {
    setSelectedDeck(deck)
    setIsCardModalVisible(true)
  }

  const startEditingCard = (card: FlashCard) => {
    setEditingCard(card)
    setCardType(card.type)
    setCardQuestion(card.question)

    if (card.type === "card") {
      setCardAnswer((card as StandardCard).answer)
    } else if (card.type === "quiz") {
      setCardOptions([...(card as QuizCard).options])
      setCorrectAnswerIndex((card as QuizCard).correctAnswerIndex)
    }
  }

  const startAddingCard = () => {
    if (!selectedDeck) return

    // Default to standard card
    setCardType("card")
    setCardQuestion("")
    setCardAnswer("")
    setCardOptions(["", "", "", ""])
    setCorrectAnswerIndex(0)

    const newCard: StandardCard = {
      id: `${selectedDeck.id}-card-${Date.now()}`,
      deckId: selectedDeck.id,
      type: "card",
      question: "",
      answer: "",
      createdAt: new Date().toISOString(),
    }

    setEditingCard(newCard)
  }

  const saveCardChanges = async () => {
    if (!selectedDeck || !editingCard) return

    try {
      let updatedCard: FlashCard

      if (cardType === "card") {
        updatedCard = {
          ...editingCard,
          type: "card",
          question: cardQuestion,
          answer: cardAnswer,
        } as StandardCard
      } else {
        updatedCard = {
          ...editingCard,
          type: "quiz",
          question: cardQuestion,
          options: [...cardOptions],
          correctAnswerIndex: correctAnswerIndex,
        } as QuizCard
      }

      let updatedDecks

      if (selectedDeck.cards.some((card) => card.id === editingCard.id)) {
        // Editing existing card
        updatedDecks = decks.map((deck) => {
          if (deck.id === selectedDeck.id) {
            return {
              ...deck,
              cards: deck.cards.map((card) => {
                if (card.id === editingCard.id) {
                  return updatedCard
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
              cards: [...deck.cards, updatedCard],
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

  // Check if a deck has quiz cards
  const hasQuizCards = (deck: ExtendedDeck) => {
    return deck.cards?.some((card) => card.type === "quiz")
  }

  const renderDeckItem = ({ item }: { item: ExtendedDeck }) => {
    const quizCardsExist = hasQuizCards(item)

    return (
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

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <Text style={styles.cardCount}>{item.cards?.length || 0} Karten</Text>

              {quizCardsExist && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    marginLeft: 6,
                  }}
                >
                  <FileQuestion size={12} color="#aaaaaa" />
                  <Text style={{ fontSize: 10, color: "#aaaaaa", marginLeft: 3 }}>Quiz</Text>
                </View>
              )}
            </View>

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
  }

  const CardItem = ({
    card,
    startEditingCard,
    deleteCard,
  }: { card: FlashCard; startEditingCard: (card: FlashCard) => void; deleteCard: (cardId: string) => void }) => {
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

    // Render different card types
    if (card.type === "quiz") {
      const quizCard = card as QuizCard
      return (
        <View style={styles.cardItem}>
          <View style={[styles.flipCardContainer, { backgroundColor: "#2a2a2a", borderRadius: 8 }]}>
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <FileQuestion size={16} color="#aaaaaa" />
                <Text style={{ color: "#aaaaaa", fontSize: 12, marginLeft: 5 }}>Quiz-Karte</Text>
              </View>

              <Text style={styles.cardSideLabel}>Frage:</Text>
              <Text style={styles.cardText}>{quizCard.question}</Text>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.cardSideLabel}>Antwortmöglichkeiten:</Text>
                {quizCard.options.map((option, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: index === quizCard.correctAnswerIndex ? "rgba(76, 175, 80, 0.2)" : "transparent",
                      padding: 8,
                      borderRadius: 4,
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 14 }}>
                      {index === quizCard.correctAnswerIndex ? "✓ " : ""}
                      {option}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

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
    } else {
      // Standard card
      const standardCard = card as StandardCard
      return (
        <View style={styles.cardItem}>
          <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={styles.flipCardContainer}>
            <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardSideLabel}>Vorderseite:</Text>
                <Text style={styles.cardText}>{standardCard.question}</Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.flipCard, backAnimatedStyle]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardSideLabel}>Rückseite:</Text>
                <Text style={styles.cardText}>{standardCard.answer}</Text>
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
                  {/* Card Type Selection */}
                  <View style={{ flexDirection: "row", marginBottom: 20 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: cardType === "card" ? "#1E88E5" : "#2a2a2a",
                        borderRadius: 8,
                        marginRight: 5,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                      onPress={() => setCardType("card")}
                    >
                      <HelpCircle size={16} color="#ffffff" />
                      <Text style={{ color: "#ffffff", marginLeft: 5 }}>Standard-Karte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: cardType === "quiz" ? "#1E88E5" : "#2a2a2a",
                        borderRadius: 8,
                        marginLeft: 5,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                      onPress={() => setCardType("quiz")}
                    >
                      <FileQuestion size={16} color="#ffffff" />
                      <Text style={{ color: "#ffffff", marginLeft: 5 }}>Quiz-Karte</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Frage</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={cardQuestion}
                      onChangeText={setCardQuestion}
                      placeholder="Frage eingeben"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  {cardType === "card" ? (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Antwort</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={cardAnswer}
                        onChangeText={setCardAnswer}
                        placeholder="Antwort eingeben"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={4}
                      />
                    </View>
                  ) : (
                    <>
                      <Text style={[styles.label, { marginBottom: 10 }]}>Antwortmöglichkeiten</Text>
                      {cardOptions.map((option, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: correctAnswerIndex === index ? "#4CAF50" : "#666",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 10,
                                backgroundColor:
                                  correctAnswerIndex === index ? "rgba(76, 175, 80, 0.2)" : "transparent",
                              }}
                              onPress={() => setCorrectAnswerIndex(index)}
                            >
                              {correctAnswerIndex === index && (
                                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#4CAF50" }} />
                              )}
                            </TouchableOpacity>
                            <TextInput
                              style={[styles.input, { flex: 1 }]}
                              value={option}
                              onChangeText={(text) => {
                                const newOptions = [...cardOptions]
                                newOptions[index] = text
                                setCardOptions(newOptions)
                              }}
                              placeholder={`Option ${index + 1}`}
                              placeholderTextColor="#666"
                            />
                          </View>
                        </View>
                      ))}
                      <Text style={{ color: "#aaaaaa", fontSize: 12, marginTop: 5 }}>
                        Wähle die richtige Antwort durch Antippen des Kreises aus.
                      </Text>
                    </>
                  )}
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
