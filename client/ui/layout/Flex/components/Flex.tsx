import React from 'react';

import { styled } from '../../..';

export interface FlexProps {
  className?: string;
  display?: 'flex' | 'inline-flex';
  flexDirection?: React.CSSProperties['flexDirection'];
  flexWrap?: React.CSSProperties['flexWrap'];
  flexFlow?: React.CSSProperties['flexFlow'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  alignContent?: React.CSSProperties['alignContent'];
  fullHeight?: boolean;
}

const FlexComponent: React.FC<FlexProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const Flex = styled(FlexComponent)(
  ({
    display = 'flex',
    flexDirection,
    flexWrap,
    flexFlow,
    justifyContent,
    alignItems,
    alignContent,
    fullHeight,
  }) => ({
    display,
    flexDirection,
    flexWrap,
    flexFlow,
    justifyContent,
    alignItems,
    alignContent,
    minHeight: fullHeight ? '100%' : 'auto',
  })
);
