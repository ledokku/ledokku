import { MaxWidthType, AutoType } from './spacing';
import { styledComponents } from '../StyledComponents';

export interface MaxWidthProps {
  maxWidth?: MaxWidthType | AutoType;
}

export const maxWidthHelper = styledComponents.css<MaxWidthProps>(
  ({ maxWidth }) => ({ maxWidth })
);
