import React, { ChangeEvent } from 'react';
import { rgba } from 'polished';
import { Typography } from '../../Typography';
import { styled } from '../../../StyledComponents';

export interface TextFieldProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?(eventOrPath: string | ChangeEvent<any>): void;
  label: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
  return (
    <Root>
      <Label>{label}</Label>
      <Input {...props} />
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled(Typography.Label)`
  margin-bottom: 8px;
`;

const Input = styled.input`
  font-family: ${({ theme }) => theme.typography.label.fontFamily};
  background: ${({ theme }) => theme.background};
  border: none;
  box-shadow: inset 0 0 0 1px ${({ theme }) => rgba(theme.foreground, 0.1)};
  height: 48px;
  padding: 0 16px;
  font-size: 1em;
  max-width: 320px;
  border-radius: 4px;
  transition: ${({ theme }) => theme.transition};

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.primary};
  }
`;
