import cx from 'classnames';

export const FormLabel = ({
  className,
  children,
  ...props
}: React.HTMLProps<HTMLLabelElement>) => (
  <label {...props} className={cx('w-full block mb-2', className)}>
    {children}
  </label>
);

interface FormInputProps extends React.HTMLProps<HTMLInputElement> {
  error?: boolean;
}

export const FormInput = ({ className, error, ...props }: FormInputProps) => {
  return (
    <input
      {...props}
      className={cx(
        'block w-full bg-white border border-grey rounded py-3 px-3 text-sm leading-tight transition duration-200 focus:outline-none focus:border-black',
        {
          'border-red-600': error,
        },
        className
      )}
    />
  );
};

interface FormHelperProps extends React.HTMLProps<HTMLParagraphElement> {
  status?: 'info' | 'error';
}

export const FormHelper = ({
  className,
  children,
  status = 'info',
  ...props
}: FormHelperProps) => (
  <p
    {...props}
    className={cx(
      'text-sm text-grey-darker mt-1',
      {
        'text-red-600': status === 'error',
      },
      className
    )}
  >
    {children}
  </p>
);
