import React from 'react';
import cx from 'classnames';
import { Button } from './Button';

interface ModalProps {
  children?: React.ReactNode;
  className?: string;
}

export const Modal = ({ children, className }: ModalProps) => (
  <div
    className={cx(
      'bg-gray-400 bg-opacity-25 absolute inset-0 flex justify-center items-center',
      className
    )}
  >
    <div className="bg-white rounded-md shadow-xl w-156 py-6 px-6">
      {children}
    </div>
  </div>
);

interface ModalTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const ModalTitle = ({ children, className }: ModalTitleProps) => (
  <div className={cx('flex justify-between items-center', className)}>
    <h3 className="text-lg font-medium">{children}</h3>
  </div>
);

interface ModalDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

export const ModalDescription = ({
  children,
  className,
}: ModalDescriptionProps) => (
  <div className={cx('mt-5 mb-50 text-sm text-gray-800', className)}>
    {children}
  </div>
);

interface ModalButtonProps {
  children?: React.ReactNode;
  className?: string;
  ctaText: string;
  otherButtonText?: string;
  isOtherButtonDisabled?: boolean;
  isCtaLoading: boolean;
  isCtaDisabled?: boolean;
  closeModal: () => void;
  ctaFn: () => void;
}

export const ModalButton = ({
  ctaText,
  className,
  otherButtonText,
  isOtherButtonDisabled,
  isCtaLoading,
  isCtaDisabled,
  closeModal,
  ctaFn,
}: ModalButtonProps) => (
  <div className={cx('mt-8 flex justify-end space-x-3', className)}>
    {otherButtonText && (
      <Button
        disabled={isCtaLoading || isOtherButtonDisabled}
        onClick={closeModal}
        color="grey"
      >
        {otherButtonText}
      </Button>
    )}
    <Button
      disabled={isCtaDisabled}
      isLoading={isCtaLoading}
      onClick={ctaFn}
      color="red"
    >
      {ctaText}
    </Button>
  </div>
);
