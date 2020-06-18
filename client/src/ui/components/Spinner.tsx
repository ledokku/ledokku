import React from 'react';
import cx from 'classnames';

interface SpinnerProps {
  className?: string;
  size: 'small' | 'large';
}

export const Spinner = ({ className, size }: SpinnerProps) => (
  <React.Fragment>
    <style>{`.loader {
  border-top-color: #1a202c;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

    @-webkit-keyframes spinner {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`}</style>

    <div
      className={cx(
        'loader ease-linear rounded-full border-gray-200 ',
        {
          'border-8 border-t-8 h-24 w-24': size === 'large',
          'border-4 border-t-4 h-8 w-8': size === 'small',
        },
        className
      )}
    ></div>
  </React.Fragment>
);
