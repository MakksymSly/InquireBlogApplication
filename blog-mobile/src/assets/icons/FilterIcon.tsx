import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const FilterIcon = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 5H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M6 12H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M10 19H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};
