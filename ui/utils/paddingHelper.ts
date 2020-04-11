import { SpacingType, AutoType } from './spacing';
import { styledComponents } from '../StyledComponents';
import { ResponsiveProperty, getResponsiveProperty } from './responsive';

export type PaddingType = ResponsiveProperty<SpacingType | AutoType>;

export interface PaddingProps {
  padding?: PaddingType;
  paddingTop?: PaddingType;
  paddingRight?: PaddingType;
  paddingBottom?: PaddingType;
  paddingLeft?: PaddingType;
}

export const paddingHelper = styledComponents.css<PaddingProps>(
  ({ theme, padding, ...props }) => {
    return styledComponents.css`
      ${getResponsiveProperty(
        'paddingTop',
        typeof props.paddingTop === 'undefined' ? padding : props.paddingTop,
        theme
      )}
      ${getResponsiveProperty(
        'paddingRight',
        typeof props.paddingRight === 'undefined'
          ? padding
          : props.paddingRight,
        theme
      )}
      ${getResponsiveProperty(
        'paddingBottom',
        typeof props.paddingBottom === 'undefined'
          ? padding
          : props.paddingBottom,
        theme
      )}
      ${getResponsiveProperty(
        'paddingLeft',
        typeof props.paddingLeft === 'undefined' ? padding : props.paddingLeft,
        theme
      )}
    `;
  }
);
