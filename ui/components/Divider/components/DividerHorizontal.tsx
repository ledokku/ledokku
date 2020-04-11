import React from 'react';
import { rgba } from 'polished';

import { styled } from '../../../StyledComponents';

export interface DividerHorizontalProps {
  className?: string;
}

export const DividerHorizontal: React.FC<DividerHorizontalProps> = (props) => {
  const { className } = props;
  return <Root className={className} />;
};

const Root = styled.div`
  height: 100%;
  width: ${({ theme }) => theme.divider.width}px;
  background: ${({ theme }) => rgba(theme.foreground, theme.divider.opacity)};
  transition: ${({ theme }) => theme.transition};
`;
