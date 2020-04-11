import React from 'react';

import { styled } from '../../..';

export interface FlexProps {
  display?: 'flex' | 'inline-flex';
  flexDirection?: React.CSSProperties['flexDirection'];
  flexWrap?: React.CSSProperties['flexWrap'];
  flexFlow?: React.CSSProperties['flexFlow'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  alignContent?: React.CSSProperties['alignContent'];
}

const FlexComponent: React.FC<FlexProps> = (props) => <div {...props} />;

export const Flex = styled(FlexComponent)(
  ({
    display = 'flex',
    flexDirection,
    flexWrap,
    flexFlow,
    justifyContent,
    alignItems,
    alignContent,
  }) => ({
    display,
    flexDirection,
    flexWrap,
    flexFlow,
    justifyContent,
    alignItems,
    alignContent,
  })
);
