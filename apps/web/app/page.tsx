'use client';

import axios from 'axios';
import { APIPaginatedResponse, Post } from '@repo/types';
import styles from './page.module.css';
import { API } from './config';
import { useEffect, useState } from 'react';

async function getPosts(): Promise<Post[]> {
  let data: APIPaginatedResponse<Post[]> = (
    await axios({
      baseURL: API,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZDVjNjh4NjAwMDBzYnV3NXJ3MmprYzQiLCJpYXQiOjE3NTI2Mzk4MDYsImV4cCI6MTc1NTIzMTgwNn0.MzzrtVm5_3DKj7sNEs8iceFJ0rbOWFeu8xvxDjKeBXU`,
      },
      url: '/posts',
      method: 'GET',
    })
  ).data;

  return data.data;
}

export default function Home() {
  let [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then((APIPosts) => setPosts(APIPosts));
  }, []);

  return (
    <div className={styles.page}>
      {posts.map((post) => (
        <a key={post.id}>{post.content}</a>
      ))}
    </div>
  );
}
