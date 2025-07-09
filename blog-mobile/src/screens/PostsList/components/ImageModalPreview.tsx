import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { scale } from '../../../utils/scale';
import { CloseIcon } from '../../../assets/icons';

interface Props {
  imageUri: string;
  onRemove: () => void;
}

export const ImageModalPreview: React.FC<Props> = ({ imageUri, onRemove }) => {
  return (
    <View style={styles.imageItem}>
      <TouchableWithoutFeedback>
        <Image source={{ uri: imageUri }} style={styles.selectedImage} />
      </TouchableWithoutFeedback>
      <View style={styles.removeButtonContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <CloseIcon size={scale(12)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageItem: {
    position: 'relative',
    marginHorizontal: scale(5),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  selectedImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(8),
  },
  removeButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: scale(30),
    height: scale(30),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: scale(5),
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    width: scale(15),
    height: scale(15),
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
});
