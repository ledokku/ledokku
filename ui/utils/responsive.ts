import { CSSProperties, FlattenSimpleInterpolation } from 'styled-components';
import { Theme } from '../themes/DefaultTheme';
import { styledComponents } from '../StyledComponents';

export interface ThemeResponsiveProperty<T> {
  phone?: T;
  tablet?: T;
  desktop?: T;
}

export interface CustomMediaResponsiveProperty<T>
  extends ThemeResponsiveProperty<T> {
  [key: number]: T;
  [key: string]: T | undefined;
}

export type ResponsiveProperty<T> = T | CustomMediaResponsiveProperty<T>;

export const getResponsiveProperty = <
  T extends keyof CSSProperties,
  S extends Theme
>(
  name: T,
  value: CSSProperties[T] | CustomMediaResponsiveProperty<CSSProperties[T]>,
  theme?: S
) => {
  if (typeof value === 'object') {
    const breakpoints = Object.keys(value);
    const style = breakpoints.reduce<FlattenSimpleInterpolation>((css, key) => {
      const media = theme && (theme.media as { [key: string]: string });

      // Checks if key is a valid number
      const isKeyValidNumber = !!+key;

      const breakpoint =
        (media && media[key]) ||
        (isKeyValidNumber ? `(min-width: ${key}px)` : key);

      const valueKey = media
        ? (key as keyof ThemeResponsiveProperty<T>)
        : isKeyValidNumber
        ? parseInt(key, 10)
        : key;

      const styledProperty = styledComponents.css({
        [name]: value[valueKey],
      });

      return styledComponents.css`
        ${css}
        @media ${breakpoint} {
          ${styledProperty}
        }
      `;
    }, styledComponents.css``);
    return style;
  } else {
    return styledComponents.css({ [name]: value });
  }
};
