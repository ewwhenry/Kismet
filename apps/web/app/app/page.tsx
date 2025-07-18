'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import type { APIPaginatedResponse, Post as PostType } from '@repo/types';
import { Post } from '../../components/Post';
import { Loader2 } from 'lucide-react';

import { API } from '../config';
import { useUser } from '@/contexts/UserContext';

async function getPosts(params: { limit?: number; cursor?: string } = {}) {
  const access_token = localStorage.getItem('access_token');
  const res = await axios<APIPaginatedResponse<PostType[]>>({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    url: '/posts',
    method: 'GET',
    params,
  });

  return res.data;
}

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { user, loading } = useUser();

  useEffect(() => {
    const fetchInitialPosts = async () => {
      const res = await getPosts();
      setPosts(res.data);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasNextPage);
    };
    fetchInitialPosts();
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]!.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0, rootMargin: '500px' },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [observerRef.current, hasMore, loadingMore]);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getPosts({ cursor: nextCursor ?? undefined });
      setPosts((prev) => [...prev, ...res.data]);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasNextPage);
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-dvh justify-center items-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full md:w-2xl md:mx-auto md:gap-2 md:mt-10 pb-16">
      <div className="pt-6 bg-zinc-100 dark:bg-zinc-900">
        {posts.map((post) => (
          <Post
            key={post.id + post.createdAt}
            post={post}
            currentUserIsAuthor={post.authorId === user!.id}
          />
        ))}

        {hasMore ? (
          <div
            ref={observerRef}
            className="py-10 text-zinc-100/20 w-full text-center"
          >
            {loadingMore ? (
              <Loader2 className="animate-spin inline-block text-white" />
            ) : (
              'Cargando más...'
            )}
          </div>
        ) : (
          <div className="py-10 text-zinc-100/20 w-full text-center">
            {posts.length === 0 ? (
              <p>You should be able to see posts here...</p>
            ) : (
              <div>¡Alcanzaste el final!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
