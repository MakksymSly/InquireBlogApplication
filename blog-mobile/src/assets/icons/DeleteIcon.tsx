import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const DeleteIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M9 6V4h6v2m-7 0h8l.72 13.29A2 2 0 0 1 14.73 21H9.27a2 2 0 0 1-1.99-1.71L6 6Z"
      stroke="#f78279"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 11v6M14 11v6" stroke="#f78279" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
