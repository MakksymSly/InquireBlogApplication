import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scale } from '../../../utils/scale';
import { PostForm, postSchema } from '../../../schemas/post.schema';
import { Post } from '../../../types/Post';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PostForm) => void;
  editingPost?: Post | null;
}

export const AddPostModal = (props: Props) => {
  const { visible, onClose, onSubmit, editingPost } = props;
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(300);
  const isVisible = useSharedValue(false);

  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: editingPost ?? {
      title: '',
      content: '',
    },
  });

  const titleValue = watch('title');
  const contentValue = watch('content');

  useEffect(() => {
    if (editingPost) {
      setValue('title', editingPost.title);
      setValue('content', editingPost.content || '');
    } else {
      setValue('title', '');
      setValue('content', '');
    }
  }, [editingPost, setValue]);

  useEffect(() => {
    if (visible && !editingPost) {
      reset({
        title: '',
        content: '',
      });
    }
  }, [visible, editingPost, reset]);

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

  const handleSubmitForm = async (data: PostForm) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (e) {
      console.error('Error in form submission:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      isVisible.value = true;
      fadeAnim.value = withTiming(1, { duration: 300 });
      slideAnim.value = withTiming(0, { duration: 300 });
    }
  }, [visible, fadeAnim, slideAnim, isVisible]);

  useEffect(() => {
    if (!visible) {
      setLoading(false);
      reset({
        title: '',
        content: '',
      });

      if (isVisible.value) {
        forceClose();
      }
    }
  }, [visible, reset, isVisible.value]);

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

  if (!visible && !isVisible.value) return null;

  return (
    <Modal visible={visible || isVisible.value} transparent animationType="none">
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={titleValue}
                onChangeText={text => setValue('title', text)}
                placeholder="Post title"
                editable={!loading}
              />
              {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

              <Text style={styles.label}>Content</Text>
              <TextInput
                style={[styles.input, { height: scale(100) }]}
                value={contentValue}
                onChangeText={text => setValue('content', text)}
                placeholder="Post content"
                multiline
                editable={!loading}
              />
              {errors.content && <Text style={styles.error}>{errors.content.message}</Text>}

              {loading && (
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <ActivityIndicator size="small" color="#007AFF" />
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit(handleSubmitForm)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading
                      ? editingPost
                        ? 'Updating...'
                        : 'Adding...'
                      : editingPost
                        ? 'Update Post'
                        : 'Add Post'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={loading}
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(10),
    backgroundColor: 'white',
  },
  label: {
    marginBottom: scale(5),
    fontWeight: '600',
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: scale(10),
    fontSize: scale(12),
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
