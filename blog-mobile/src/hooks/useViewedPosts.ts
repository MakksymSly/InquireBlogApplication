import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIEWED_POSTS_KEY = 'viewed_posts';

export const useViewedPosts = () => {
  const [viewedPosts, setViewedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadViewedPosts();
  }, []);

  const loadViewedPosts = async () => {
    try {
      const stored = await AsyncStorage.getItem(VIEWED_POSTS_KEY);
      if (stored) {
        const viewedArray = JSON.parse(stored);
        setViewedPosts(new Set(viewedArray));
      }
    } catch (error) {
      console.error('Error loading viewed posts:', error);
    }
  };

  const markPostAsViewed = async (postId: number) => {
    try {
      const newViewedPosts = new Set(viewedPosts);
      newViewedPosts.add(postId);
      setViewedPosts(newViewedPosts);

      await AsyncStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify([...newViewedPosts]));
    } catch (error) {
      console.error('Error marking post as viewed:', error);
    }
  };

  const isPostViewed = (postId: number): boolean => {
    return viewedPosts.has(postId);
  };

  const clearViewedPosts = async () => {
    try {
      setViewedPosts(new Set());
      await AsyncStorage.removeItem(VIEWED_POSTS_KEY);
    } catch (error) {
      console.error('Error clearing viewed posts:', error);
    }
  };

  const removePostFromViewed = async (postId: number) => {
    try {
      const newViewedPosts = new Set(viewedPosts);
      newViewedPosts.delete(postId);
      setViewedPosts(newViewedPosts);

      await AsyncStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify([...newViewedPosts]));
    } catch (error) {
      console.error('Error removing post from viewed:', error);
    }
  };

  return {
    viewedPosts,
    markPostAsViewed,
    isPostViewed,
    clearViewedPosts,
    removePostFromViewed,
  };
}; 