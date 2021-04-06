import { useToast as useToastChakra, UseToastOptions } from '@chakra-ui/react';

export const useToast = () => {
  const toastChakra = useToastChakra();

  const error = (description: string, options?: UseToastOptions) => {
    return toastChakra({
      description: description,
      status: 'error',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
      ...options,
    });
  };

  const success = (description: string, options?: UseToastOptions) => {
    return toastChakra({
      description: description,
      status: 'success',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
      ...options,
    });
  };

  const info = (description: string, options?: UseToastOptions) => {
    return toastChakra({
      description: description,
      status: 'info',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
      ...options,
    });
  };

  const warning = (description: string, options?: UseToastOptions) => {
    return toastChakra({
      description: description,
      status: 'info',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
      ...options,
    });
  };

  const toast = {
    success,
    error,
    info,
    warning,
  };

  return toast;
};
