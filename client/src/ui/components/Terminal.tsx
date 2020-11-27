import cx from 'classnames';

interface TerminalProps {
  children?: React.ReactNode;
  className?: string;
}

export const Terminal = ({ children, className }: TerminalProps) => (
  <div
    className={cx(
      'mt-3 shadow-lg text-gray-100 text-sm leading-normal font-mono subpixel-antialiased bg-gray-900 p-4 rounded-lg',
      className
    )}
  >
    {children}
  </div>
);
