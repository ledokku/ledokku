import { useToast as useToastChakra } from '@chakra-ui/react';

export const useToast = () => {
  const toastChakra = useToastChakra();

  const error = (description: string) => {
    return toastChakra({
      description: description,
      status: 'error',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
    });
  };

  const success = (description: string) => {
    return toastChakra({
      description: description,
      status: 'success',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
    });
  };

  const info = (description: string) => {
    return toastChakra({
      description: description,
      status: 'info',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
    });
  };

  const warning = (description: string) => {
    return toastChakra({
      description: description,
      status: 'info',
      position: 'top-left',
      duration: 5000,
      isClosable: true,
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
