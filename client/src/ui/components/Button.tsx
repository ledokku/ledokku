import React from 'react';
import cx from 'classnames';

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  color: 'red' | 'grey';
  width: 'normal' | 'large';
}

export const Button = ({
  children,
  color,
  width,
  className,
  iconEnd,
  iconStart,
  type,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    type={type === 'submit' ? 'submit' : 'button'}
    className={cx(
      'py-2 px-10 bg-gray-900 hover:bg-blue text-white  font-bold  rounded-lg flex justify-center',
      {
        'bg-gray-900': color === 'grey',
        'bg-red-500': color === 'red',
        'opacity-50 cursor-not-allowed': props.disabled,
        'hover:text-white border hover:border-transparent': !props.disabled,
        'w-64': width === 'large',
        'w-32': width === 'normal',
      },
      className
    )}
  >
    {iconStart && <span className="-ml-4 mr-4 -px-4">{iconStart}</span>}
    {children}
    {iconEnd && <span className="ml-6 -mr-4 -px-4">{iconEnd}</span>}
  </button>
);
