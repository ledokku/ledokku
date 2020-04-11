import React from 'react';
import { styled } from '../../..';

export interface FlexItemProps {
  alignSelf?: React.CSSProperties['alignSelf'];
}

const FlexItemComponent: React.FC<FlexItemProps> = (props) => (
  <div {...props} />
);

export const FlexItem = styled(FlexItemComponent)`
  align-self: ${({ alignSelf }) => alignSelf};
`;
