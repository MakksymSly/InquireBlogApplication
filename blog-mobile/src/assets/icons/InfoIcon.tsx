import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const InfoIcon = ({ size = 24, color = 'black' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    <Path d="M12 16v-4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
