import React from 'react';
import cx from 'classnames';
import Link, { LinkProps } from 'next/link';

interface TabNavProps {
  children?: React.ReactNode;
  className?: string;
}

export const TabNav = ({ children, className }: TabNavProps) => (
  <nav
    className={cx(
      'flex space-x-5 text-sm leading-5 border-b border-gray-200',
      className
    )}
  >
    {children}
  </nav>
);

interface TabNavLinkProps extends LinkProps {
  children?: React.ReactNode;
  className?: string;
  selected?: boolean;
}

export const TabNavLink = ({
  children,
  className,
  selected,
  ...props
}: TabNavLinkProps) => (
  <Link {...props}>
    <a
      className={cx(
        'py-3 px-0.5 transition-colors ease-in-out duration-150',
        {
          'text-gray-500 hover:text-black ': !selected,
          '-mb-px border-b border-black text-black': selected,
        },
        className
      )}
    >
      {children}
    </a>
  </Link>
);
