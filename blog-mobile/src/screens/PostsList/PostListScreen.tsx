import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { usePostStore } from '../../store/usePostStore';
import { ScreenWrapper } from '../../components/ScreenWrapper/ScreenWrapper';
import { scale } from '../../utils/scale';
import { PostCard } from './components';
import { Post } from '../../types/Post';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getPosts } from '../../api/posts';
import { AddPostModal } from './components/AddPostModal';
import { createPost, updatePost, deletePost } from '../../api/posts';
import { getCommentsCount } from '../../api/comments';
import { PostForm } from '../../schemas/post.schema';
import { FilterIcon, PlusIcon, SearchIcon } from '../../assets/icons';
import { useViewedPosts } from '../../hooks/useViewedPosts';
import { useThemeStore } from '../../store/useThemeStore';

export const PostListScreen = () => {
  const { posts, setPosts, updateCommentsCount } = usePostStore();
  const { colors } = useThemeStore();
  const themedStyles = createThemedStyles(colors);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { markPostAsViewed, isPostViewed, removePostFromViewed } = useViewedPosts();

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    return posts.filter(
      (post: Post) =>
        post.title.toLowerCase().includes(query) ||
        (post.content && post.content.toLowerCase().includes(query)),
    );
  }, [posts, searchQuery]);

  const loadPosts = async (isRefreshing = false) => {
    const setLoadingState = isRefreshing ? setRefreshing : setLoading;
    setLoadingState(true);

    try {
      const data = await getPosts();

      const postsWithCommentsCount = await Promise.all(
        data.map(async (post: Post) => {
          try {
            const commentsCount = await getCommentsCount(post.id);
            return { ...post, commentsCount };
          } catch (error) {
            console.error(`Error loading comments count for post ${post.id}:`, error);
            return { ...post, commentsCount: 0 };
          }
        }),
      );

      setPosts(postsWithCommentsCount);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = () => {
    loadPosts(true);
  };

  const onPostPress = (item: Post) => {
    markPostAsViewed(item.id);
    navigation.navigate('PostDetails', { postId: item.id });
  };

  const onPostDelete = async (id: number) => {
    try {
      await deletePost(id);

      setPosts(posts.filter(post => post.id !== id));
      removePostFromViewed(id);

      if (editingPost && editingPost.id === id) {
        setModalVisible(false);
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setModalVisible(false);
      setEditingPost(null);
    }
  };

  const onPostEdit = (post: Post) => {
    setEditingPost(post);
    setModalVisible(true);
  };

  const handleCreatePost = async (data: PostForm) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, data);
        setPosts(
          posts.map(p =>
            p.id === editingPost.id
              ? {
                  ...p,
                  title: data.title,
                  content: data.content,
                  imageUrls: data.imageUrls,
                }
              : p,
          ),
        );
        setModalVisible(false);
        setEditingPost(null);
      } else {
        const newPost = await createPost(data);
        const postWithComments = {
          ...newPost,
          comments: newPost.comments || [],
        };
        setPosts([postWithComments, ...posts]);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating/updating post:', error);

      setModalVisible(false);
      setEditingPost(null);
    }
  };

  return (
    <ScreenWrapper withoutHeader scrollEnable={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={themedStyles.container}>
          {error && (
            <View style={themedStyles.errorContainer}>
              <Text style={themedStyles.errorText}>{error}</Text>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={themedStyles.loadingText}>Loading posts...</Text>
            </View>
          ) : (
            <>
              <View style={themedStyles.header}>
                <View style={styles.searchContainer}>
                  <View style={themedStyles.searchInputContainer}>
                    <SearchIcon />
                    <TextInput
                      style={themedStyles.searchInput}
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor={'#000'}
                    />
                    {searchQuery.length > 0 && (
                      <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                        <Text style={themedStyles.clearButtonText}>✕</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
                <View style={themedStyles.actionButtons}>
                  <Pressable style={themedStyles.filterButton}>
                    <FilterIcon size={scale(20)} color={colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => setModalVisible(true)} style={themedStyles.plusButton}>
                    <PlusIcon size={scale(28)} color={colors.primary} />
                  </Pressable>
                </View>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={filteredPosts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <PostCard
                    onPress={() => onPostPress(item)}
                    post={item}
                    onDelete={onPostDelete}
                    onEdit={onPostEdit}
                    hideActions={modalVisible}
                    isViewed={isPostViewed(item.id)}
                  />
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </>
          )}

          <AddPostModal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setEditingPost(null);
            }}
            onSubmit={handleCreatePost}
            editingPost={editingPost}
            key={`modal-${modalVisible}-${editingPost?.id || 'new'}`}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    errorContainer: {
      padding: scale(16),
      margin: 16,
      borderRadius: 8,
      backgroundColor: colors.error + '20',
    },
    errorText: {
      textAlign: 'center',
      color: colors.error,
    },
    loadingText: {
      color: colors.textPrimary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: scale(16),
      marginBottom: scale(12),
      padding: scale(12),
      backgroundColor: colors.cardBackground,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: scale(12),
      paddingHorizontal: scale(12),
      paddingVertical: scale(8),
      borderWidth: 1,
      backgroundColor: colors.lightBackground,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      height: scale(30),
      marginLeft: scale(8),
      fontSize: scale(16),
      paddingVertical: scale(4),
      color: '#000',
    },
    clearButtonText: {
      fontSize: scale(14),
      fontWeight: '600',
      color: '#000',
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },
    filterButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      backgroundColor: colors.cardBackground,
      shadowColor: '#000',
    },
    plusButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      backgroundColor: colors.cardBackground,
      shadowColor: '#000',
    },
  });

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    marginRight: scale(12),
  },
  clearButton: {
    padding: scale(4),
    marginLeft: scale(8),
  },
});
