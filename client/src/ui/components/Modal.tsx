import React from 'react';
import { Button } from './Button';

interface ModalProps {
  children?: React.ReactNode;
  className?: string;
}

export const Modal = ({ children, className }: ModalProps) => (
  <div className="bg-gray-400 bg-opacity-25 absolute inset-0 flex justify-center items-center">
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
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-medium">{children}</h3>
  </div>
);

interface ModalDescriptionProps {
  children?: React.ReactNode;
  className?: string;
}

export const ModalDescription = ({ children }: ModalDescriptionProps) => (
  <div className="mt-5 mb-50 text-sm text-gray-800">{children}</div>
);

interface ModalButtonProps {
  children?: React.ReactNode;
  className?: string;
  ctaText: string;
  otherButtonText?: string;
  isCtaLoading: boolean;
  isCtaDisabled?: boolean;
  closeModal: () => void;
  ctaFn: () => void;
}

export const ModalButton = ({
  ctaText,
  otherButtonText,
  isCtaLoading,
  isCtaDisabled,
  closeModal,
  ctaFn,
}: ModalButtonProps) => (
  <div className="mt-8 flex justify-end space-x-3">
    {otherButtonText && (
      <Button disabled={isCtaLoading} onClick={closeModal} color="grey">
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
