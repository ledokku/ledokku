import { styledComponents } from '../../../StyledComponents';

export interface TypographyProps {
  textAlign?: React.CSSProperties['textAlign'];
  textTransform?: React.CSSProperties['textTransform'];
  textDecoration?: React.CSSProperties['textDecoration'];
  fontWeight?: React.CSSProperties['fontWeight'];
}

export const typographyHelper = styledComponents.css<TypographyProps>(
  ({
    textAlign,
    textTransform,
    textDecoration,
    fontWeight,
  }: TypographyProps) => {
    return styledComponents.css({
      textAlign,
      textTransform,
      textDecoration,
      fontWeight,
    });
  }
);
