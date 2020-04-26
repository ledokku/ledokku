import { styledComponents } from '../../../StyledComponents';
import { SpacingType } from '../../../utils/spacing';

export interface SpacingTypographyProps {
  marginTop?: SpacingType;
  marginBottom?: SpacingType;
}

export const spacingTypographyHelper = styledComponents.css<
  SpacingTypographyProps
>(({ marginTop, marginBottom }: SpacingTypographyProps) => {
  return styledComponents.css({
    marginTop,
    marginBottom,
    '&:first-child': {
      marginTop: typeof marginTop === 'undefined' ? 0 : marginTop,
    },
    '&:last-child': {
      marginBottom: typeof marginBottom === 'undefined' ? 0 : marginBottom,
    },
  });
});
