import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BASE_WIDTH = 393; // IPHONE 14 PRO

export const scale = (size: number) => {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleFactor));
};