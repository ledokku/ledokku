import { toast } from 'react-toastify';

export const useToast = () => {
  const error = (description: string) => {
    return toast.error(description, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const success = (description: string) => {
    return toast.success(description, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const info = (description: string) => {
    return toast.info(description, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const warning = (description: string) => {
    return toast.warn(description, {
      position: 'top-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const toasts = {
    success,
    error,
    info,
    warning,
  };

  return toasts;
};
