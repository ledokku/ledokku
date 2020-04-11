import React from 'react';

import { styled } from '../../../StyledComponents';
import { TypographyProps, typographyHelper } from '../utils/typographyHelper';

export interface LinkProps extends TypographyProps {
  className?: string;
  href?: string;
  target?: string;
  alt?: string;
}

export const Link: React.FC<LinkProps> = (props) => {
  const { textDecoration = 'underline', ...rest } = props;
  return <Root textDecoration={textDecoration} {...rest} />;
};

const RootComponent: React.FC<LinkProps> = (props) => <a {...props} />;

const RootWithTheme = styled(RootComponent)(({ theme }) => ({
  ...theme.typography.link,
  color: theme.foreground,
}));

const Root = styled(RootWithTheme)`
  ${typographyHelper}
  color: ${({ theme }) => theme.foreground};
`;
