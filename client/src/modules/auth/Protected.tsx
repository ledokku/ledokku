import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

interface ProtectedProps {
  children: JSX.Element;
}

// TODO delete this file after cra migration
export const Protected = ({ children }: ProtectedProps) => {
  const router = useRouter();
  const { loggedIn } = useAuth();

  // We only redirect client side
  if (!loggedIn && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  return children;
};
