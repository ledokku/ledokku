import React from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  size?: 'normal' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  size = 'normal',
  startIcon,
  endIcon,
  children,
}) => (
  <Root size={size}>
    {startIcon && <StartIcon>{startIcon}</StartIcon>}
    {children}
    {endIcon && <EndIcon>{endIcon}</EndIcon>}
  </Root>
);

const Icon = styled.span`
  height: 24px;
`;

const StartIcon = styled(Icon)`
  margin-right: 12px;
`;
const EndIcon = styled(Icon)`
  margin-left: 12px;
`;

const Root = styled.button`
  display: flex;
  flex-direction: row;
  padding: 0 32px;

  height: ${({ size }: ButtonProps) => (size === 'normal' ? 48 : 56)}px;

  background: #000000;
  border-radius: 4px;
  border: none;

  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;
  color: white;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.6;
  }
  &:focus {
    outline: none;
  }
`;
