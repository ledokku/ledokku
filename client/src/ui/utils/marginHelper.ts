import { SpacingType, AutoType } from './spacing';
import { styledComponents } from '../StyledComponents';
import { ResponsiveProperty, getResponsiveProperty } from './responsive';

export type MarginType = ResponsiveProperty<SpacingType | AutoType>;

export interface MarginProps {
  margin?: MarginType;
  marginTop?: MarginType;
  marginRight?: MarginType;
  marginBottom?: MarginType;
  marginLeft?: MarginType;
}

export const marginHelper = styledComponents.css<MarginProps>(
  ({ theme, margin, ...props }) => {
    return styledComponents.css`
      ${getResponsiveProperty(
        'marginTop',
        typeof props.marginTop === 'undefined' ? margin : props.marginTop,
        theme
      )}
      ${getResponsiveProperty(
        'marginRight',
        typeof props.marginRight === 'undefined' ? margin : props.marginRight,
        theme
      )}
      ${getResponsiveProperty(
        'marginBottom',
        typeof props.marginBottom === 'undefined' ? margin : props.marginBottom,
        theme
      )}
      ${getResponsiveProperty(
        'marginLeft',
        typeof props.marginLeft === 'undefined' ? margin : props.marginLeft,
        theme
      )}
    `;
  }
);
