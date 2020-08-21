import React from 'react';
import { Spinner, Button } from './';

interface ModalProps {
  closeModalButton: string;
  ctaButton: string;
  mainText: React.ReactNode;
  header: string;
  closeModal: () => void;
  ctaFn: () => void;
  isCtaLoading: boolean;
  isWarningModal: boolean;
}

export const Modal = ({
  closeModalButton,
  ctaButton,
  mainText,
  header,
  isCtaLoading,
  isWarningModal,
  ctaFn,
  closeModal,
}: ModalProps) => (
  <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 bg-gray-400 opacity-25"></div>
    </div>

    <div
      className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          {isWarningModal && (
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          )}
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-headline"
            >
              {header}
            </h3>
            <div className="mt-2">
              <p className="text-sm leading-5 text-gray-500">{mainText}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
          <Button
            color="grey"
            width="normal"
            type="button"
            onClick={ctaFn}
            disabled={isCtaLoading}
            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
          >
            {isCtaLoading ? <Spinner size="extraSmall" /> : ctaButton}
          </Button>
        </span>
        <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
          <Button
            color="grey"
            width="normal"
            type="button"
            onClick={closeModal}
            disabled={isCtaLoading}
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
          >
            {closeModalButton}
          </Button>
        </span>
      </div>
    </div>
  </div>
);
