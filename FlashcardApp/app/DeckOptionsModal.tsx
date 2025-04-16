import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';
import { DECK_COLORS } from './types';

interface DeckOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
}

const DeckOptionsModal = ({ 
  visible, 
  onClose, 
  onSave, 
  initialName = '', 
  initialColor = Object.values(DECK_COLORS)[0] 
}: DeckOptionsModalProps) => {
  const [name, setName] = useState(initialName);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, selectedColor);
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Deck Options</Text>
          <Text style={styles.subtitle}>Customize your flashcard deck</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Deck Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.subtitle}>Choose a color</Text>
          <View style={styles.colorRow}>
            {Object.values(DECK_COLORS).map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorCircleSelected
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, styles.modalButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, styles.modalButton]} 
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeckOptionsModal;