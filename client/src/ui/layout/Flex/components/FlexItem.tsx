import React from 'react';
import { styled } from '../../..';

export interface FlexItemProps {
  className?: string;
  alignSelf?: React.CSSProperties['alignSelf'];
  flexGrow?: number;
}

const FlexItemComponent: React.FC<FlexItemProps> = ({
  className,
  children,
}) => <div className={className}>{children}</div>;

export const FlexItem = styled(FlexItemComponent)`
  align-self: ${({ alignSelf }) => alignSelf};
  flex-grow: ${({ flexGrow }) => flexGrow};
`;
