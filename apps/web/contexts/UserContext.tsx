'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { API } from '@/app/config';
import { APISuccessResponse, User } from '@repo/types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          location.href = '/auth';
          return;
        }
        // Assume an API endpoint to get the currently authenticated user
        const response = await axios({
          method: 'GET',
          baseURL: API,
          url: '/users/@me',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setUser((response.data as APISuccessResponse<User>).data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError('An unknown error occurred');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
