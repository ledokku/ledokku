import React from 'react';

import { styled } from '../../../StyledComponents';

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  size?: 'normal' | 'large';
  variant?: 'solid';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    variant = 'solid',
    size = 'normal',
    startIcon,
    endIcon,
  } = props;

  return (
    <Root {...props} variant={variant} size={size}>
      {startIcon && <StartIcon>{startIcon}</StartIcon>}
      <Label>{children}</Label>
      {endIcon && <EndIcon>{endIcon}</EndIcon>}
    </Root>
  );
};

const RootComponent: React.FC<ButtonProps> = ({
  variant,
  size,
  startIcon,
  endIcon,
  ...props
}) => <button {...props} />;

const Root = styled(RootComponent)`
  position: relative;
  box-sizing: border-box;
  background: ${({ theme, variant }) =>
    variant === 'solid' ? theme.foreground : 'transparent'};
  border: none;
  color: ${({ theme, variant }) =>
    variant === 'solid' ? theme.background : theme.foreground};
  border-radius: 4px;
  font-weight: ${({ variant }) => (variant === 'solid' ? 500 : 400)};
  padding: 0;
  margin: 0;
  cursor: pointer;
  height: 48px;
  transition: all ${({ theme }) => theme.transition}, transform 50ms;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.1);

  display: inline-flex;
  flex-direction: row;
  padding: 0 32px;
  align-items: center;

  height: ${({ size }: ButtonProps) => (size === 'normal' ? 48 : 56)}px;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.6;
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const Icon = styled.span`
  height: 24px;
`;

const StartIcon = styled(Icon)`
  margin-right: 12px;
`;
const EndIcon = styled(Icon)`
  margin-left: 12px;
`;

const LabelText = styled.span<ButtonProps>(({ theme }) => ({
  ...theme.typography.button,
}));

const Label = styled(LabelText)`
  display: inline-block;
  color: currentColor;
`;
