import React from 'react';
import { Svg, Path, Rect, Circle } from 'react-native-svg';

export const AddImageIcon = ({ size = 32, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Rect x="6" y="12" width="44" height="32" rx="4" ry="4" stroke={color} strokeWidth="3" />

      <Path
        d="M10 38L20 28L30 36L40 24L48 32"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Circle cx="18" cy="20" r="3" fill={color} />

      <Path d="M52 22V10M46 16H58" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
};
