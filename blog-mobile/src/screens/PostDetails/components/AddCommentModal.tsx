import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { scale } from '../../../utils/scale';
import { createCommentSchema } from '../../../schemas/comment.schema';

interface AddCommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (author: string, text: string) => void;
  isLoading?: boolean;
}

export const AddCommentModal: React.FC<AddCommentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(300);
  const isVisible = useSharedValue(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleClose = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
    } else {
      isVisible.value = false;
      fadeAnim.value = withTiming(0, { duration: 200 });
      slideAnim.value = withTiming(300, { duration: 200 }, () => {
        runOnJS(onClose)();
      });
    }
  };

  const forceClose = () => {
    isVisible.value = false;
    fadeAnim.value = 0;
    slideAnim.value = 300;
    onClose();
  };

  const handleSubmit = () => {
    try {
      const validatedData = createCommentSchema.parse({
        author: author.trim(),
        text: text.trim(),
        postId: 1,
      });

      onSubmit(validatedData.author, validatedData.text);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Validation Error', error.message);
      } else {
        Alert.alert('Error', 'Please check your input');
      }
    }
  };

  const handleCloseAndReset = () => {
    setAuthor('');
    setText('');
    handleClose();
  };

  useEffect(() => {
    if (!visible) {
      setAuthor('');
      setText('');
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      isVisible.value = true;
      fadeAnim.value = withTiming(1, { duration: 300 });
      slideAnim.value = withTiming(0, { duration: 300 });
    }
  }, [visible, fadeAnim, slideAnim, isVisible]);

  useEffect(() => {
    if (!visible) {
      forceClose();
    }
  }, [visible]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideAnim.value }],
    };
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#999"
                value={author}
                onChangeText={setAuthor}
                maxLength={50}
                editable={!isLoading}
              />

              <Text style={styles.label}>Comment</Text>
              <TextInput
                style={[styles.input, { height: scale(100) }]}
                placeholder="Comment text..."
                placeholderTextColor="#999"
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
                editable={!isLoading}
              />

              {isLoading && (
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <ActivityIndicator size="small" color="#007AFF" />
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                  <Text style={styles.buttonText}>{isLoading ? 'Adding...' : 'Add Comment'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCloseAndReset}
                  disabled={isLoading}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: scale(12),
    padding: scale(20),
    margin: scale(20),
    width: '90%',
    maxWidth: scale(400),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    marginBottom: scale(5),
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(10),
    backgroundColor: 'white',
    fontSize: scale(16),
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(15),
  },
  button: {
    flex: 1,
    marginHorizontal: scale(5),
    backgroundColor: '#007AFF',
    padding: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: scale(16),
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    color: '#007AFF',
  },
});
