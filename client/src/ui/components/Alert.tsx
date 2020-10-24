import cx from 'classnames';

interface AlertProps {
  children?: React.ReactNode;
  className?: string;
  status: 'info' | 'warning' | 'error';
}

export const Alert = ({
  children,
  className,
  status,
  ...props
}: AlertProps) => (
  <div
    {...props}
    className={cx(
      'px-4 py-3 shadow-md rounded-b border-t-4',
      { 'bg-blue-100 text-blue-900 border-blue-500': status === 'info' },
      {
        'bg-orange-100 text-orange-700 border-orange-500': status === 'warning',
      },
      { 'bg-red-100 text-red-900 border-red-500': status === 'error' },
      className
    )}
  >
    {children}
  </div>
);

interface AlertTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const AlertTitle = ({
  children,
  className,
  ...props
}: AlertTitleProps) => (
  <p {...props} className={cx('font-bold', className)}>
    {children}
  </p>
);

interface AlertDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

export const AlertDescription = ({
  children,
  className,
  ...props
}: AlertDescriptionProps) => (
  <p {...props} className={cx('text-sm', className)}>
    {children}
  </p>
);
