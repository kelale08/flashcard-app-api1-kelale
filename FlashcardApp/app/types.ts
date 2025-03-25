// Definiert die Struktur einer Karteikarte
export interface Card {
    id: string // Eindeutige ID der Karte
    front: string // Vorderseite/Frage der Karte
    back: string // Rückseite/Antwort der Karte
    deckId?: string // Referenz zum übergeordneten Deck
    createdAt?: string // Erstellungsdatum
    lastReviewed?: string // Datum der letzten Überprüfung
  }
  
  // Definiert die Struktur eines Decks
  export interface Deck {
    id: string // Eindeutige ID des Decks
    name: string // Name des Decks
    description?: string // Optionale Beschreibung des Decks
    color: string // Farbe des Decks
    cards: Card[] // Array von Karteikarten in diesem Deck
    createdAt: string // Erstellungsdatum
  }
  
  // Typ für ein Listenelement (kann ein Deck oder eine Karte sein)
  export type Item = Deck | Card
  
  // Hilfsfunktion, um zu prüfen, ob ein Item ein Deck ist
  export function isDeck(item: Item): item is Deck {
    return (item as Deck).cards !== undefined
  }
  
  // Hilfsfunktion, um zu prüfen, ob ein Item eine Karte ist
  export function isCard(item: Item): item is Card {
    return (item as Card).front !== undefined && (item as Card).back !== undefined
  }
  
  // Interface für Deck-Parameter in Routen
  export interface DeckParams {
    id: string // Deck-ID aus der URL
  }
  
  // Interface für Karten-Parameter in Routen
  export interface CardParams {
    deckId: string // ID des übergeordneten Decks
    cardId?: string // Optionale Karten-ID (für Bearbeitung)
  }
  
  // Interface für Lernstatistiken
  export interface StudyStats {
    deckId: string // ID des Decks
    cardsReviewed: number // Anzahl der überprüften Karten
    correctAnswers: number // Anzahl der richtigen Antworten
    lastStudied: string // Datum der letzten Lernsitzung
  }
  
  // Interface für Benutzereinstellungen
  export interface UserSettings {
    darkMode: boolean // Dunkler Modus aktiviert?
    cardReviewInterval: number // Intervall für Kartenwiederholungen (in Tagen)
    notificationsEnabled: boolean // Benachrichtigungen aktiviert?
  }
  
  // Verfügbare Deck-Farben
  export const DECK_COLORS = {
    blue: "#1E88E5",
    green: "#43A047",
    purple: "#8E24AA",
    orange: "#FB8C00",
    red: "#E53935",
  }
  
  