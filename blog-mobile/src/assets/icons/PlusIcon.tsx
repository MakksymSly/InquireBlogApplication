import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export const PlusIcon = () => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
    <Circle cx="15" cy="15" r="15" fill="white" />
    <Path d="M15 9V21" stroke="#14a2f5" strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 15H21" stroke="#14a2f5" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
