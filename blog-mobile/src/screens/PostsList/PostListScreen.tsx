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
  Modal,
  Switch,
  ScrollView,
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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    withAttachments: false,
    withoutAttachments: false,
    withComments: false,
    withoutComments: false,
    viewed: false,
    notViewed: false,
  });
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const { markPostAsViewed, isPostViewed, removePostFromViewed } = useViewedPosts();

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Поиск по тексту
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (post: Post) =>
          post.title.toLowerCase().includes(query) ||
          (post.content && post.content.toLowerCase().includes(query)),
      );
    }

    // Фильтр по вложениям
    if (activeFilters.withAttachments) {
      filtered = filtered.filter((post: Post) => post.imageUrls && post.imageUrls.length > 0);
    }
    if (activeFilters.withoutAttachments) {
      filtered = filtered.filter((post: Post) => !post.imageUrls || post.imageUrls.length === 0);
    }

    // Фильтр по комментариям
    if (activeFilters.withComments) {
      filtered = filtered.filter((post: Post) => post.commentsCount && post.commentsCount > 0);
    }
    if (activeFilters.withoutComments) {
      filtered = filtered.filter((post: Post) => !post.commentsCount || post.commentsCount === 0);
    }

    // Фильтр по просмотренным
    if (activeFilters.viewed) {
      filtered = filtered.filter((post: Post) => isPostViewed(post.id));
    }
    if (activeFilters.notViewed) {
      filtered = filtered.filter((post: Post) => !isPostViewed(post.id));
    }

    return filtered;
  }, [posts, searchQuery, activeFilters, isPostViewed]);

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
    setDeletingPostId(id);
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
    } finally {
      setDeletingPostId(null);
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
                  <Pressable
                    style={themedStyles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                  >
                    <FilterIcon size={scale(20)} color={colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => setModalVisible(true)} style={themedStyles.plusButton}>
                    <PlusIcon size={scale(28)} color={colors.primary} />
                  </Pressable>
                </View>
              </View>
              {filteredPosts.length === 0 ? (
                <View style={themedStyles.emptyContainer}>
                  <Text style={themedStyles.emptyTitle}>No posts yet</Text>
                  <Text style={themedStyles.emptySubtitle}>
                    Create your first post by pressing + on top
                  </Text>
                  <Text style={themedStyles.emptyHint}>
                    Tip: Swipe left on posts to edit or delete them
                  </Text>
                </View>
              ) : (
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
                      isDeleting={deletingPostId === item.id}
                    />
                  )}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              )}
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

          {/* Filter Modal */}
          <Modal
            visible={filterModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setFilterModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
              <View style={themedStyles.filterModalOverlay}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={themedStyles.filterModalContent}>
                    <Text style={themedStyles.filterModalTitle}>Filter Posts</Text>

                    <ScrollView style={themedStyles.filterOptions}>
                      <View style={themedStyles.filterSection}>
                        <Text style={themedStyles.filterSectionTitle}>Attachments</Text>
                        <View style={themedStyles.filterOption}>
                          <Text style={themedStyles.filterOptionText}>With attachments</Text>
                          <Switch
                            value={activeFilters.withAttachments}
                            onValueChange={value =>
                              setActiveFilters(prev => ({
                                ...prev,
                                withAttachments: value,
                                withoutAttachments: value ? false : prev.withoutAttachments,
                              }))
                            }
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={
                              activeFilters.withAttachments ? colors.accent : colors.textSecondary
                            }
                          />
                        </View>
                        <View style={themedStyles.filterOption}>
                          <Text style={themedStyles.filterOptionText}>Without attachments</Text>
                          <Switch
                            value={activeFilters.withoutAttachments}
                            onValueChange={value =>
                              setActiveFilters(prev => ({
                                ...prev,
                                withoutAttachments: value,
                                withAttachments: value ? false : prev.withAttachments,
                              }))
                            }
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={
                              activeFilters.withoutAttachments
                                ? colors.accent
                                : colors.textSecondary
                            }
                          />
                        </View>
                      </View>

                      <View style={themedStyles.filterSection}>
                        <Text style={themedStyles.filterSectionTitle}>Comments</Text>
                        <View style={themedStyles.filterOption}>
                          <Text style={themedStyles.filterOptionText}>With comments</Text>
                          <Switch
                            value={activeFilters.withComments}
                            onValueChange={value =>
                              setActiveFilters(prev => ({
                                ...prev,
                                withComments: value,
                                withoutComments: value ? false : prev.withoutComments,
                              }))
                            }
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={
                              activeFilters.withComments ? colors.accent : colors.textSecondary
                            }
                          />
                        </View>
                        <View style={themedStyles.filterOption}>
                          <Text style={themedStyles.filterOptionText}>Without comments</Text>
                          <Switch
                            value={activeFilters.withoutComments}
                            onValueChange={value =>
                              setActiveFilters(prev => ({
                                ...prev,
                                withoutComments: value,
                                withComments: value ? false : prev.withComments,
                              }))
                            }
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={
                              activeFilters.withoutComments ? colors.accent : colors.textSecondary
                            }
                          />
                        </View>
                      </View>

                      <View style={themedStyles.filterSection}>
                        <Text style={themedStyles.filterSectionTitle}>Viewed Status</Text>
                        <View style={themedStyles.filterOption}>
                          <Text style={themedStyles.filterOptionText}>Viewed posts</Text>
                          <Switch
                            value={activeFilters.viewed}
                            onValueChange={value =>
                              setActiveFilters(prev => ({
                                ...prev,
                                viewed: value,
                                notViewed: value ? false : prev.notViewed,
                              }))
                            }
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={activeFilters.viewed ? colors.accent : colors.textSecondary}
                          />
                        </View>
                        <View style={themedStyles.filterOption}>
                          <Text style={themedStyles.filterOptionText}>Not viewed posts</Text>
                          <Switch
                            value={activeFilters.notViewed}
                            onValueChange={value =>
                              setActiveFilters(prev => ({
                                ...prev,
                                notViewed: value,
                                viewed: value ? false : prev.viewed,
                              }))
                            }
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={
                              activeFilters.notViewed ? colors.accent : colors.textSecondary
                            }
                          />
                        </View>
                      </View>
                    </ScrollView>

                    <View style={themedStyles.filterModalButtons}>
                      <Pressable
                        style={themedStyles.filterButtonSecondary}
                        onPress={() =>
                          setActiveFilters({
                            withAttachments: false,
                            withoutAttachments: false,
                            withComments: false,
                            withoutComments: false,
                            viewed: false,
                            notViewed: false,
                          })
                        }
                      >
                        <Text style={themedStyles.filterButtonText}>Clear All</Text>
                      </Pressable>
                      <Pressable
                        style={themedStyles.filterButtonPrimary}
                        onPress={() => setFilterModalVisible(false)}
                      >
                        <Text style={[themedStyles.filterButtonText, { color: colors.buttonText }]}>
                          Apply
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
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
    filterModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterModalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: scale(16),
      padding: scale(20),
      margin: scale(20),
      width: '90%',
      maxWidth: scale(400),
      maxHeight: '80%',
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    filterModalTitle: {
      fontSize: scale(18),
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: scale(16),
      textAlign: 'center',
    },
    filterOptions: {
      maxHeight: scale(400),
    },
    filterSection: {
      marginBottom: scale(20),
    },
    filterSectionTitle: {
      fontSize: scale(16),
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: scale(12),
    },
    filterOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: scale(8),
    },
    filterOptionText: {
      fontSize: scale(14),
      color: colors.textSecondary,
      flex: 1,
    },
    filterModalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scale(20),
      gap: scale(12),
    },
    filterButtonSecondary: {
      flex: 1,
      padding: scale(12),
      borderRadius: scale(8),
      backgroundColor: colors.lightBackground,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonPrimary: {
      flex: 1,
      padding: scale(12),
      borderRadius: scale(8),
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    filterButtonText: {
      fontSize: scale(14),
      fontWeight: '600',
      color: colors.primary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(20),
    },
    emptyTitle: {
      fontSize: scale(20),
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: scale(8),
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: scale(16),
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: scale(24),
      marginBottom: scale(16),
    },
    emptyHint: {
      fontSize: scale(14),
      color: colors.primary,
      textAlign: 'center',
      lineHeight: scale(20),
      fontStyle: 'italic',
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
