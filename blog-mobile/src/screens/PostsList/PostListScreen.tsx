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
import { createPost, updatePost } from '../../api/posts';
import { getCommentsCount } from '../../api/comments';
import { PostForm } from '../../schemas/post.schema';
import { PlusIcon, SearchIcon } from '../../assets/icons';

export const PostListScreen = () => {
  const { posts, setPosts, updateCommentsCount } = usePostStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
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

  useEffect(() => {
    setLoading(true);
    getPosts()
      .then(async data => {
        setPosts(data);

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
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch posts');
        setLoading(false);
      });
  }, []);

  const onPostPress = (item: Post) => {
    navigation.navigate('PostDetails', { postId: item.id });
  };
  const onPostDelete = (id: number) => {
    try {
      setPosts(posts.filter(post => post.id !== id));
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
        <View style={styles.container}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading posts...</Text>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <SearchIcon />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                      <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>✕</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
                <Pressable onPress={() => setModalVisible(true)} style={styles.plusButton}>
                  <PlusIcon />
                </Pressable>
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
                  />
                )}
                refreshing={loading}
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

const styles = StyleSheet.create({
  errorContainer: {
    padding: scale(16),
    backgroundColor: '#ffebee',
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopEndRadius: scale(16),
    borderTopStartRadius: scale(16),
    backgroundColor: '#fff',
    padding: scale(12),
  },
  searchContainer: {
    flex: 1,
    marginRight: scale(12),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    height: scale(30),
    marginLeft: scale(8),
    fontSize: scale(16),
    color: '#333',
    paddingVertical: scale(4),
  },
  clearButton: {
    padding: scale(4),
    marginLeft: scale(8),
  },
  clearButtonText: {
    fontSize: scale(14),
    color: '#999',
    fontWeight: '600',
  },
  plusButton: {
    bottom: scale(0),
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
  },
});
