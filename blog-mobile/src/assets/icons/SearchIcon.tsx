import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const SearchIcon = () => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14Zm0-2a9 9 0 1 0 5.92 15.84l4.12 4.12a1 1 0 0 0 1.41-1.41l-4.12-4.12A9 9 0 0 0 11 2Z"
        fill="#000000"
      />
    </Svg>
  );
};
