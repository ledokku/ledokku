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
}

export const BoxButton: React.FC<BoxButtonProps> = ({ children, ...props }) => {
  const { label, icon } = props;
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
  background: ${({ theme }) => theme.background};
  box-shadow: inset 0 0 0 ${({ selected }) => (selected ? 2 : 1)}px
    ${({ selected, theme }) =>
      selected ? theme.primary : rgba(theme.foreground, 0.1)};
  transition: ${({ theme }) => theme.transition};
  color: ${({ selected, theme }) =>
    selected ? theme.primary : theme.foreground};
  padding: 24px;
  border-radius: 4px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  * {
    opacity: ${({ disabled }) => (disabled ? 0.25 : 1)};
  }
`;

const Icon = styled.div``;

const Label = styled(Typography.Label)`
  color: currentColor;
`;
