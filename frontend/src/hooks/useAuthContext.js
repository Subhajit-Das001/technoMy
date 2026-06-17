import { useMemo } from 'react';

const useAuthContext = () => {
  const isAuthenticated = useMemo(() => {
    return Boolean(
      localStorage.getItem('sessionId') ||
      localStorage.getItem('sessionToken') ||
      localStorage.getItem('token')
    );
  }, []);

  return { isAuthenticated };
};

export default useAuthContext;
