import React from 'react';
import { styled } from '../../../StyledComponents';

import { TypographyProps, typographyHelper } from '../utils/typographyHelper';
import {
  SpacingTypographyProps,
  spacingTypographyHelper,
} from '../utils/spacingTypographyHelper';

export interface CaptionProps extends TypographyProps, SpacingTypographyProps {
  className?: string;
  display?: 'block' | 'inline';
}

export const Caption: React.FC<CaptionProps> = (props) => <Root {...props} />;

const RootComponent: React.FC<CaptionProps> = (props) => {
  const { className, children } = props;
  return <span className={className}>{children}</span>;
};

const RootWithTheme = styled(RootComponent)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.foreground,
}));

const Root = styled(RootWithTheme)`
  ${typographyHelper}
  ${spacingTypographyHelper}
  display: ${({ display = 'block' }) => display};
`;
