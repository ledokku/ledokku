import React from 'react';

import { styled } from '../../../StyledComponents';
import { TypographyProps, typographyHelper } from '../utils/typographyHelper';
import {
  SpacingTypographyProps,
  spacingTypographyHelper,
} from '../utils/spacingTypographyHelper';

export interface HeadlineProps extends TypographyProps, SpacingTypographyProps {
  className?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children?: string | React.ReactNode;
}

export const Headline: React.FC<HeadlineProps> = (props) => {
  const { children = '', ...rest } = props;
  return <Root {...rest}>{children}</Root>;
};

export interface RootComponentProps extends Omit<HeadlineProps, 'children'> {
  children?: React.ReactNode;
  id?: string;
}

const RootComponent: React.FC<RootComponentProps> = (props) => {
  const { level, className, children, id } = props;
  return React.createElement(`h${level}`, { className, id }, children);
};

const RootWithTheme = styled(RootComponent)(
  ({
    theme,
    level,
    marginTop = theme.typography[`h${level}` as 'h1'].marginTop,
    marginBottom = theme.typography[`h${level}` as 'h1'].marginBottom,
    textAlign,
  }) => ({
    ...theme.typography[`h${level}` as 'h1'],
    color: theme.foreground,
    marginTop,
    marginBottom,
    textAlign,
  })
);

const Root = styled(RootWithTheme)`
  ${typographyHelper}
  ${spacingTypographyHelper}
  position: relative;
`;
