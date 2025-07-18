'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API } from '../config';
import { APISuccessResponse } from '@repo/types';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submitLogin = () => {
    axios({
      method: 'POST',
      baseURL: API,
      url: '/auth/login',
      data: {
        username,
        password,
      },
    }).then((res) => {
      let data = res.data as APISuccessResponse;

      localStorage.setItem('access_token', data.data.access_token);

      location.href = '/app';
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full md:w-xl max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Email or username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              type="username"
              placeholder="example@example.com or example"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="text"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={submitLogin}>
            Sign in
          </Button>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
