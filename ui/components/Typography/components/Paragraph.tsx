import React from 'react';

import { styled } from '../../../StyledComponents';
import { TypographyProps, typographyHelper } from '../utils/typographyHelper';
import {
  SpacingTypographyProps,
  spacingTypographyHelper,
} from '../utils/spacingTypographyHelper';

export interface ParagraphProps
  extends TypographyProps,
    SpacingTypographyProps {
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = (props) => {
  const { children } = props;
  return <Root {...props}>{children}</Root>;
};

const RootComponent: React.FC<ParagraphProps> = (props) => {
  const { className, children } = props;
  return <p className={className}>{children}</p>;
};

const RootWithTheme = styled(RootComponent)(({ theme }) => ({
  ...theme.typography.paragraph,
  color: theme.foreground,
}));

const Root = styled(RootWithTheme)`
  ${typographyHelper}
  ${spacingTypographyHelper}
`;
