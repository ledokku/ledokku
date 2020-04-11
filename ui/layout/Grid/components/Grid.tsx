import React, { useMemo } from 'react';
import { CSSProperties } from 'styled-components';

import { styled } from '../../../StyledComponents';
import {
  ResponsiveProperty,
  getResponsiveProperty,
} from '../../../utils/responsive';
import { processResponsiveTemplate } from '../utils/processResponsiveTemplate';
import { SpacingType } from '../../../utils/spacing';
import { maxWidthHelper, MaxWidthProps } from '../../../utils/maxWidthHelper';
import { marginHelper, MarginProps } from '../../../utils/marginHelper';
import { paddingHelper, PaddingProps } from '../../../utils/paddingHelper';

export type GridDisplay = 'grid' | 'inline-grid';
export type GridTemplateItem = number | string;
export type GridTemplate = GridTemplateItem[] | string;
export type GridGap = SpacingType;

export interface SharedGridProps
  extends MaxWidthProps,
    MarginProps,
    PaddingProps {
  justifyItems?: ResponsiveProperty<'start' | 'end' | 'center' | 'stretch'>;
  alignItems?: ResponsiveProperty<'start' | 'end' | 'center' | 'stretch'>;
  justifyContent?: ResponsiveProperty<
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
  >;
  alignContent?: ResponsiveProperty<
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
  >;
  children: React.ReactNode;
}

export interface GridProps extends SharedGridProps {
  className?: string;
  display?: ResponsiveProperty<GridDisplay>;
  templateColumns?: ResponsiveProperty<GridTemplate>;
  templateRows?: ResponsiveProperty<GridTemplate>;
  columnGap?: ResponsiveProperty<GridGap>;
  rowGap?: ResponsiveProperty<GridGap>;
}

export const Grid: React.FC<GridProps> = (props) => {
  const {
    children,
    className,
    display = 'grid',
    templateColumns,
    templateRows,
    columnGap,
    rowGap,
    ...rest
  } = props;

  const gridTemplateColumns = useMemo(() => {
    return processResponsiveTemplate(templateColumns);
  }, [templateColumns]);

  const gridTemplateRows = useMemo(() => {
    return processResponsiveTemplate(templateRows);
  }, [templateRows]);

  return (
    <Root
      className={className}
      display={display}
      gridTemplateColumns={gridTemplateColumns}
      gridTemplateRows={gridTemplateRows}
      gridColumnGap={columnGap}
      gridRowGap={rowGap}
      {...rest}
    >
      {children}
    </Root>
  );
};

export interface TransformedGridProps extends SharedGridProps {
  className?: string;
  display: ResponsiveProperty<CSSProperties['display']>;
  gridTemplateColumns?: ResponsiveProperty<
    CSSProperties['gridTemplateColumns']
  >;
  gridTemplateRows?: ResponsiveProperty<CSSProperties['gridTemplateRows']>;
  gridColumnGap?: ResponsiveProperty<CSSProperties['gridColumnGap']>;
  gridRowGap?: ResponsiveProperty<CSSProperties['gridRowGap']>;
}

const RootComponent: React.FC<TransformedGridProps> = (props) => {
  const { children, className } = props;
  return <div className={className}>{children}</div>;
};
const Root = styled(RootComponent)`
  ${maxWidthHelper}
  ${marginHelper}
  ${paddingHelper}
  ${({ theme, display }) => getResponsiveProperty('display', display, theme)}
  ${({ theme, gridTemplateColumns }) =>
    getResponsiveProperty('gridTemplateColumns', gridTemplateColumns, theme)}
  ${({ theme, gridTemplateRows }) =>
    getResponsiveProperty('gridTemplateRows', gridTemplateRows, theme)}
  ${({ theme, gridColumnGap }) =>
    getResponsiveProperty('gridColumnGap', gridColumnGap, theme)}
  ${({ theme, gridRowGap }) =>
    getResponsiveProperty('gridRowGap', gridRowGap, theme)}

  ${({ theme, justifyItems }) =>
    getResponsiveProperty('justifyItems', justifyItems, theme)}
  ${({ theme, alignItems }) =>
    getResponsiveProperty('alignItems', alignItems, theme)}
  ${({ theme, justifyContent }) =>
    getResponsiveProperty('justifyContent', justifyContent, theme)}
  ${({ theme, alignContent }) =>
    getResponsiveProperty('alignContent', alignContent, theme)}
`;
