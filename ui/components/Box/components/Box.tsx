import React from 'react';
import { styled } from '../../../StyledComponents';
import { MarginProps, marginHelper } from '../../../utils/marginHelper';
import { PaddingProps, paddingHelper } from '../../../utils/paddingHelper';
import { MaxWidthProps, maxWidthHelper } from '../../../utils/maxWidthHelper';

export interface BoxProps extends MarginProps, PaddingProps, MaxWidthProps {
  className?: string;
}

export const Box: React.FC<BoxProps> = (props) => {
  return <Root {...props} />;
};

const RootComponent: React.FC<BoxProps> = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const Root = styled(RootComponent)`
  ${marginHelper}
  ${paddingHelper}
  ${maxWidthHelper}
`;
