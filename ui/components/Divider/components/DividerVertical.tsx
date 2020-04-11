import React from 'react';
import { rgba } from 'polished';

import { styled } from '../../../StyledComponents';

export interface DividerVerticalProps {
  className?: string;
}

export const DividerVertical: React.FC<DividerVerticalProps> = (props) => {
  const { className } = props;
  return <Root className={className} />;
};

const Root = styled.div`
  height: 100%;
  width: ${({ theme }) => theme.divider.width}px;
  background: ${({ theme }) => rgba(theme.foreground, theme.divider.opacity)};
  transition: ${({ theme }) => theme.transition};
`;
