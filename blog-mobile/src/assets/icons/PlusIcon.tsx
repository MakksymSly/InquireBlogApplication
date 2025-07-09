import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PlusIcon = ({ size = 30, color = '#14a2f5' }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path d="M15 9V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 15H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
