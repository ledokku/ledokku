import React from 'react';
import cx from 'classnames';

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  color: 'red' | 'grey';
  variant?: 'solid' | 'outline';
}

export const Button = ({
  children,
  color,
  className,
  iconEnd,
  iconStart,
  type,
  variant = 'solid',
  ...props
}: ButtonProps) => (
  <button
    {...props}
    type={type === 'submit' ? 'submit' : 'button'}
    className={cx(
      'px-3 py-2 font-bold rounded-lg flex justify-center min-w-7',
      // solid variant styles
      variant === 'solid'
        ? {
            'bg-gray-900 text-white transition-color duration-100 ease-in': true,
            'bg-red-500': color === 'red',
            'hover:text-white border hover:border-transparent': !props.disabled,
            'opacity-50 cursor-not-allowed': props.disabled,
          }
        : undefined,
      // outline variant styles
      variant === 'outline'
        ? {
            'text-gray-900 border border-gray-200 transition-color duration-100 ease-in': true,
            'hover:border-gray-900': !props.disabled,
            'opacity-50 cursor-not-allowed': props.disabled,
          }
        : undefined,
      className
    )}
  >
    {iconStart && <span className="mr-3">{iconStart}</span>}
    {children}
    {iconEnd && <span className="ml-3">{iconEnd}</span>}
  </button>
);
