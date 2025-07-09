import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const AttachmentIcon = ({ size = 24, color = '#fff' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 6.5L8.5 14.5C7.67157 15.3284 7.67157 16.6716 8.5 17.5C9.32843 18.3284 10.6716 18.3284 11.5 17.5L19.5 9.5C21.1569 7.84315 21.1569 5.15685 19.5 3.5C17.8431 1.84315 15.1569 1.84315 13.5 3.5L5.5 11.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
