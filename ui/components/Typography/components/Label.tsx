import React from 'react';
import { styled } from '../../../StyledComponents';

import { TypographyProps, typographyHelper } from '../utils/typographyHelper';
import {
  SpacingTypographyProps,
  spacingTypographyHelper,
} from '../utils/spacingTypographyHelper';

export interface LabelProps extends TypographyProps, SpacingTypographyProps {
  className?: string;
  display?: 'block' | 'inline';
  opacity?: number;
}

export const Label: React.FC<LabelProps> = (props) => <Root {...props} />;

const RootComponent: React.FC<LabelProps> = (props) => {
  const { className, children } = props;
  return <span className={className}>{children}</span>;
};

const RootWithTheme = styled(RootComponent)(({ theme }) => ({
  ...theme.typography.label,
  color: theme.foreground,
}));

const Root = styled(RootWithTheme)`
  ${typographyHelper}
  ${spacingTypographyHelper}
  display: ${({ display = 'block' }) => display};
  opacity: ${({ opacity }) => opacity};
`;
