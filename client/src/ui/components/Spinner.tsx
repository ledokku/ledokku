import React from 'react';
import cx from 'classnames';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size: 'small' | 'large' | 'extraSmall';
  className?: string;
}

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  animation: ${rotate360} 1.5s linear infinite;
  border-top-color: #1a202c;
  transition-timing-function: linear;
`;

export const Spinner = ({ size, className, ...props }: SpinnerProps) => (
  <StyledSpinner
    {...props}
    className={cx(
      'rounded-full border-gray-200 ',
      {
        'border-8 border-t-8 h-24 w-24': size === 'large',
        'border-4 border-t-3 h-6 w-6': size === 'small',
        'border-2 border-t-2 h-4 w-4': size === 'extraSmall',
      },
      className
    )}
  />
);
