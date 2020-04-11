import React from 'react';

import { styled } from '../../../StyledComponents';
import { MarginProps, marginHelper } from '../../../utils/marginHelper';
import { PaddingProps, paddingHelper } from '../../../utils/paddingHelper';
import { MaxWidthProps, maxWidthHelper } from '../../../utils/maxWidthHelper';

export interface PaperProps extends MarginProps, PaddingProps, MaxWidthProps {
  className?: string;
}

export const Paper: React.FC<PaperProps> = (props) => {
  const { children, className } = props;

  return (
    <Root className={className} {...props}>
      <Content {...props}>{children}</Content>
    </Root>
  );
};

const RootComponent: React.FC<PaperProps> = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const Root = styled(RootComponent)`
  ${marginHelper}
  ${maxWidthHelper}
  position: relative;
`;

const ContentComponent: React.FC<PaperProps> = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const Content = styled(ContentComponent)`
  ${paddingHelper}
  position: relative;
  z-index: 1;
`;
