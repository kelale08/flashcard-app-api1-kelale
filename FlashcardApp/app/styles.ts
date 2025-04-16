import { StyleSheet, Dimensions } from "react-native"

// Get screen dimensions for responsive grid
const { width, height } = Dimensions.get("window")
const itemMargin = 8
const gridItemWidth = (width - 40 - itemMargin * 2) / 2 // 40 for container padding, itemMargin*2 for spacing between items

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  // Text styles
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
  },

  // Button styles
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#444",
  },
  createButton: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  addButton: {
    backgroundColor: "#1E88E5",
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },

  // Grid styles for deck display
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: gridItemWidth,
    marginBottom: 16,
  },
  gridDeckWrapper: {
    borderRadius: 10,
    backgroundColor: "#2a2a2a",
    overflow: "hidden",
    height: 160,
    position: "relative",
  },
  gridDeckContent: {
    padding: 12,
    flex: 1,
    position: "relative",
  },
  colorBand: {
    height: 8,
    width: "100%",
  },
  gridMoreButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    padding: 6,
    backgroundColor: "rgba(42, 42, 42, 0.8)",
    borderRadius: 15,
  },
  gridDeleteButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    padding: 6,
    backgroundColor: "rgba(42, 42, 42, 0.8)",
    borderRadius: 15,
  },

  // Original deck styles (kept for reference)
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  deckDescription: {
    fontSize: 12,
    color: "#aaaaaa",
    marginBottom: 6,
    flex: 1,
  },
  cardCount: {
    fontSize: 11,
    color: "#888888",
    marginBottom: 20,
  },

  // Form styles
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

  // Color picker styles
  colorPickerContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    marginTop: 0,
    height: 400,
  },
  colorPickerSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  colorPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 10,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginRight: 15,
  },
  colorHexText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Action Menu styles
  actionMenuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  actionMenu: {
    position: "absolute",
    width: 200,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  actionMenuItemDelete: {
    borderBottomWidth: 0,
  },
  actionMenuText: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
  },
  actionMenuTextDelete: {
    color: "#ff4d4d",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
    maxHeight: height * 0.6,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },

  // Card styles
  cardItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  cardContent: {
    padding: 15,
  },
  cardSide: {
    marginBottom: 10,
  },
  cardSideLabel: {
    color: "#aaaaaa",
    fontSize: 12,
    marginBottom: 5,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  cardActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  cardActionText: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 5,
  },
  cardDeleteButton: {
    borderLeftWidth: 1,
    borderLeftColor: "#444",
  },
  cardDeleteText: {
    color: "#ff4d4d",
  },

  // Flip card styles
  flipCardContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  flipCard: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardContent: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
  },

  // Edit Deck Modal styles
  editDeckModalContent: {
    maxHeight: height * 0.9,
  },
  compactPreviewAndButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  compactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  compactColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  compactInputGroup: {
    marginBottom: 12,
  },
  compactLabel: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 4,
  },
  compactInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
    padding: 10,
    color: "#ffffff",
    fontSize: 14,
  },
  compactTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  compactColorPickerContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 10,
    height: 180,
    justifyContent: "center",
  },
  compactButtonGroup: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
  },
  compactButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 10,
    minWidth: 100,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginRight: 15,
  },


  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '85%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  // Color selection specific styles
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#444',
    margin: 5,
  },
  colorCircleSelected: {
    borderColor: '#ffffff',
    borderWidth: 3,
  },
})
export default styles

