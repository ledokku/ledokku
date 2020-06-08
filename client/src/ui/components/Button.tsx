import React from 'react';
import cx from 'classnames';

interface ButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  color: 'red' | 'grey';
  disabled?: boolean;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  const { icon, color, disabled, className } = props;
  return (
    <button
      className={cx(
        'inline py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold  rounded-lg',
        {
          'bg-gray-900': color === 'grey',
          'bg-red-500': color === 'red',
          'opacity-50 cursor-not-allowed': disabled,
          'hover:text-white border hover:border-transparent': !disabled,
        },

        className
      )}
    >
      {children}
    </button>
  );
};
