import React from 'react';

import { styled } from '../../..';

export interface PageProps {
  temp?: any;
}

export const Page: React.FC<PageProps> = (props) => {
  return <Root>{props.children}</Root>;
};

const Root = styled.div`
  overflow: hidden;
  min-height: 100%;
  transition: ${(props) => props.theme.transition};
`;
