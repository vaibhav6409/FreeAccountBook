import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export default function HeaderActionsSheet({ isVisible, onClose }) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.row}>
          <Text>🔽 Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text>🎯 Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text>⚙ Settings</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  row: {
    paddingVertical: 14,
  },
});
