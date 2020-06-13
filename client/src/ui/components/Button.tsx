import React from 'react';
import cx from 'classnames';

interface ButtonProps {
  children?: React.ReactNode;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  className?: string;
  color: 'red' | 'grey';
  disabled?: boolean;
  size?: 'normal' | 'large';
  isSubmit?: boolean;
  onClick?(): void;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  const {
    iconEnd,
    iconStart,
    color,
    disabled,
    className,
    size,
    isSubmit,
    onClick,
  } = props;
  return (
    <button
      onClick={onClick}
      type={isSubmit ? 'submit' : 'button'}
      className={cx(
        'py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold  rounded-lg flex justify-center',
        {
          'bg-gray-900': color === 'grey',
          'bg-red-500': color === 'red',
          'opacity-50 cursor-not-allowed': disabled,
          'hover:text-white border hover:border-transparent': !disabled,
          'w-64': size === 'large',
          'w-32': size === 'normal',
        },
        className
      )}
    >
      {iconStart && <span className="-ml-4 mr-4 -px-4">{iconStart}</span>}
      {children}

      {iconEnd && <span className="ml-6 -mr-4 -px-4">{iconEnd}</span>}
    </button>
  );
};
