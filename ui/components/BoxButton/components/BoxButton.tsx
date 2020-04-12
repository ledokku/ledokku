import React from 'react';
import { rgba } from 'polished';

import { styled } from '../../../StyledComponents';
import { Box } from '../../Box';
import { BoxProps } from '../../Box/components/Box';
import { Typography } from '../../Typography';

export interface BoxButtonProps extends BoxProps {
  className?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  size?: 'normal' | 'large';
  onClick?(): void;
}

export const BoxButton: React.FC<BoxButtonProps> = ({ children, ...props }) => {
  const { label, icon, size = 'normal' } = props;
  return (
    <Root {...props}>
      {icon && <Icon>{icon}</Icon>}
      {label && <Label>{label}</Label>}
    </Root>
  );
};

const RootComponent: React.FC<BoxButtonProps> = ({
  selected,
  icon,
  label,
  disabled,
  ...props
}) => <Box {...props} />;

const Root = styled(RootComponent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.background};
  box-shadow: inset 0 0 0 ${({ selected }) => (selected ? 2 : 1)}px
    ${({ selected, theme }) =>
      selected ? theme.primary : rgba(theme.foreground, 0.1)};
  transition: ${({ theme }) => theme.transition};
  color: ${({ selected, theme }) =>
    selected ? theme.primary : theme.foreground};
  padding: ${({ size }) => (size === 'normal' ? 24 : 64)}px
    ${({ size }) => (size === 'normal' ? 24 : 64)}px;
  border-radius: 4px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    box-shadow: inset 0 0 0 2px
      ${({ theme, disabled }) =>
        disabled ? rgba(theme.foreground, 0.1) : theme.primary};
    color: ${({ theme, disabled }) =>
      disabled ? theme.foreground : theme.primary};
  }

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.75;
    transform: scale(${({ theme, disabled }) => (disabled ? 0.98 : 0.95)});
  }

  * {
    opacity: ${({ disabled }) => (disabled ? 0.25 : 1)};
  }
`;

const Icon = styled.div`
  font-size: 0;
  margin-bottom: 16px;
`;

const Label = styled(Typography.Label)`
  color: currentColor;
`;
