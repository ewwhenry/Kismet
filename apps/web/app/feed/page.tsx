'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import type { APIPaginatedResponse, Post as PostType } from '@repo/types';
import { Post } from '../../components/Post';
import { Bell } from 'lucide-react';

import { API } from '../config';
import { Navbar } from '@/components/Navbar';

async function getPosts(): Promise<PostType[]> {
  let data: APIPaginatedResponse<PostType[]> = (
    await axios({
      baseURL: API,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZDgydG9neDAwMDJxaGI0eWhobGN1ZGMiLCJpYXQiOjE3NTI3OTk0MjYsImV4cCI6MTc1NTM5MTQyNn0.HyVsrdczHFuNnAWXBuedY68I1Ly7qtSr4xXnmvq_mEc`,
      },
      url: '/posts',
      method: 'GET',
    })
  ).data;

  return data.data;
}

export default function Home() {
  let [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getPosts().then((APIPosts) => setPosts(APIPosts));
  }, []);

  return (
    <div className="flex flex-col w-full md:w-2xl md:mx-auto md:gap-2 md:mt-10">
      <div className="pt-6 bg-zinc-100 dark:bg-zinc-900">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
