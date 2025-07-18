'use client';

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { APISuccessResponse, User } from '@repo/types';
import { API } from './config';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    let access_token = localStorage.getItem('access_token');

    if (access_token) {
      // But we have to check if the token is valid, to do that, we will call the /users/@me api endpoint.
      axios({
        method: 'GET',
        baseURL: API,
        url: '/users/@me',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((response) => {
        let data = response.data as APISuccessResponse<User>;

        // If the username and id came with the response, it means that the JWT is valid.
        // So, we redirect the user to the feed.
        if (data.data.username && data.data.id) {
          setIsAuthenticated(1);
          setTimeout(() => (location.href = '/app'), 1e3);
        }
      });
    } else {
      // It mean that the user is not authenticated.
      setIsAuthenticated(-1);
      setTimeout(() => (location.href = '/auth'), 2e3);
    }
  }, []);

  if (isAuthenticated === 0)
    return (
      <div className="flex w-full h-dvh justify-center items-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );

  if (isAuthenticated === -1)
    return (
      <div className="flex w-full h-dvh justify-center items-center">
        <h1>Unauthorized, redirecting to login</h1>
      </div>
    );

  if (isAuthenticated === 1)
    return (
      <div className="flex w-full h-dvh justify-center items-center">
        <h1>Authorized!, redirecting to feed.</h1>
      </div>
    );
}
