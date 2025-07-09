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
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
import { ImageModalPreview } from './ImageModalPreview';
import { AttachmentIcon } from '../../../assets/icons';
import { uploadImage } from '../../../api/posts';
import { useThemeStore } from '../../../store/useThemeStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PostForm) => void;
  editingPost?: Post | null;
}

export const AddPostModal = (props: Props) => {
  const { visible, onClose, onSubmit, editingPost } = props;
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(300);
  const isVisible = useSharedValue(false);

  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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
      imageUrls: [],
    },
  });

  const titleValue = watch('title');
  const contentValue = watch('content');

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        setLoading(true);

        try {
          const uploadResult = await uploadImage(imageUri);
          const serverUrl = `${process.env.EXPO_PUBLIC_BASE_URL}${uploadResult.url}`;

          const newImages = [...selectedImages, serverUrl];
          setSelectedImages(newImages);
          setValue('imageUrls', newImages);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          const newImages = [...selectedImages, imageUri];
          setSelectedImages(newImages);
          setValue('imageUrls', newImages);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setValue('imageUrls', newImages);
  };

  useEffect(() => {
    if (editingPost) {
      setValue('title', editingPost.title);
      setValue('content', editingPost.content || '');
      setValue('imageUrls', editingPost.imageUrls || []);
      setSelectedImages(editingPost.imageUrls || []);
    } else {
      setValue('title', '');
      setValue('content', '');
      setValue('imageUrls', []);
      setSelectedImages([]);
    }
  }, [editingPost, setValue]);

  useEffect(() => {
    if (visible && !editingPost) {
      reset({
        title: '',
        content: '',
        imageUrls: [],
      });
      setSelectedImages([]);
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
        imageUrls: [],
      });
      forceClose();
    }
  }, [visible, reset]);

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
      <TouchableOpacity
        style={[themedStyles.container, containerAnimatedStyle]}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          style={[themedStyles.modalContent, modalAnimatedStyle]}
          activeOpacity={1}
          onPress={() => {}}
        >
          <Text style={themedStyles.label}>Title</Text>
          <TextInput
            style={themedStyles.input}
            value={titleValue}
            onChangeText={text => setValue('title', text)}
            placeholder="Post title"
            placeholderTextColor={colors.textSecondary}
            editable={!loading}
          />
          {errors.title && <Text style={themedStyles.error}>{errors.title.message}</Text>}

          <Text style={themedStyles.label}>Content</Text>
          <TextInput
            style={[themedStyles.input, { height: scale(100) }]}
            value={contentValue}
            onChangeText={text => setValue('content', text)}
            placeholder="Post content"
            placeholderTextColor={colors.textSecondary}
            multiline
            editable={!loading}
          />
          {errors.content && <Text style={themedStyles.error}>{errors.content.message}</Text>}

          <Text style={themedStyles.label}>Attachments</Text>
          <View style={styles.imagesContainer}>
            {selectedImages.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagesScrollContent}
                nestedScrollEnabled={true}
              >
                {selectedImages.map((imageUri, index) => (
                  <ImageModalPreview
                    key={index}
                    imageUri={imageUri}
                    onRemove={() => removeImage(index)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={themedStyles.emptyContainer}>
                <Text style={themedStyles.emptyText}>No attachments</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={themedStyles.addImageButton} onPress={pickImage}>
            <AttachmentIcon size={scale(24)} />
            <Text style={themedStyles.addImageText}>Add Image</Text>
          </TouchableOpacity>

          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={themedStyles.button}
              onPress={handleSubmit(handleSubmitForm)}
              disabled={loading}
            >
              <Text style={themedStyles.buttonText}>
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
              style={[themedStyles.button, themedStyles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={[themedStyles.buttonText, themedStyles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: scale(12),
      padding: scale(20),
      margin: scale(20),
      width: '90%',
      maxWidth: scale(400),
      shadowColor: colors.textPrimary,
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
      borderColor: colors.border,
      borderRadius: scale(8),
      padding: scale(12),
      marginBottom: scale(10),
      backgroundColor: colors.background,
      fontSize: scale(16),
      color: colors.textPrimary,
    },
    label: {
      marginBottom: scale(5),
      fontWeight: '600',
      color: colors.textPrimary,
    },
    error: {
      color: colors.error,
      marginBottom: scale(10),
      fontSize: scale(12),
    },
    emptyContainer: {
      height: scale(120),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: scale(14),
      fontWeight: '500',
    },
    addImageButton: {
      backgroundColor: colors.primary,
      paddingVertical: scale(12),
      paddingHorizontal: scale(20),
      borderRadius: scale(8),
      alignItems: 'center',
      marginTop: scale(10),
      flexDirection: 'row',
      justifyContent: 'center',
    },
    addImageText: {
      color: colors.buttonText,
      fontSize: scale(16),
      fontWeight: '600',
    },
    button: {
      flex: 1,
      marginHorizontal: scale(5),
      backgroundColor: colors.primary,
      padding: scale(12),
      borderRadius: scale(8),
      alignItems: 'center',
    },
    buttonText: {
      color: colors.buttonText,
      fontWeight: '600',
      fontSize: scale(16),
    },
    cancelButton: {
      backgroundColor: colors.lightBackground,
    },
    cancelButtonText: {
      color: colors.primary,
    },
  });

const styles = StyleSheet.create({
  imagesContainer: {
    marginTop: scale(10),
    marginBottom: scale(10),
    height: scale(120),
  },
  imagesScrollContent: {
    paddingHorizontal: scale(5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(15),
  },
});
