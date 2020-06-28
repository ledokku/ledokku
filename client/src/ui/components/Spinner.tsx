import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size: 'small' | 'large';
}

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// ${({ theme }) => theme.background};
const StyledSpinner = styled.div`
  animation: ${rotate360} 1.5s linear infinite;
  height: ${(props: SpinnerProps) =>
    props.size === 'small' ? '3rem' : '6rem'};
  width: ${(props: SpinnerProps) => (props.size === 'small' ? '3rem' : '6rem')};
  border-radius: 9999px;
  border-width: ${(props: SpinnerProps) =>
    props.size === 'small' ? '0.3rem' : '0.5rem'};
  border-top-width: ${(props: SpinnerProps) =>
    props.size === 'small' ? '0.3rem' : '0.5rem'};
  border-top-color: #1a202c;
  color: white;
  transition-timing-function: linear;
`;

export const Spinner = (props: SpinnerProps) => <StyledSpinner {...props} />;
