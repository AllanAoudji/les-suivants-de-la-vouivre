'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import useScrollPosition from '@src/hooks/useScrollPosition';
import { getPosts } from '@/sanity/sanity.queries';
import PostCard from './PostCard';

type Props = {
  posts: Post[];
};

function Posts({ posts: initialPost }: Props) {
  const [lastPublishedAt, setLastPublishedAt] = useState<string>('');
  const [lastSlug, setLastSlug] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>(initialPost);

  const initaleFetchingRef = useRef<boolean>(true);
  const mountedRef = useRef<boolean>(true);

  const scrollPosition = useScrollPosition();

  const postGetter = useCallback(async () => {
    if (lastSlug == null) return;

    setLoading(true);

    const result = await getPosts(lastPublishedAt, lastSlug);

    if (!mountedRef.current) return;

    setPosts((prevState) => [...prevState, ...result]);
    if (result.length > 20) {
      setLastSlug(result[result.length - 1].slug);
      setLastPublishedAt(result[result.length - 1].publishedAt);
    } else {
      setLastSlug(null);
    }
    setLoading(false);
  }, [lastPublishedAt, lastSlug]);

  // initial post fetching
  // only trigger on mount
  useEffect(() => {
    if (!initaleFetchingRef.current) {
      return;
    }
    if (posts.length > 20) {
      setLastSlug(posts[posts.length - 1].slug);
      setLastPublishedAt(posts[posts.length - 1].publishedAt);
    } else {
      setLastSlug(null);
    }
    initaleFetchingRef.current = false;
  }, [posts]);

  // fetch next post if scroll to bottom
  useEffect(() => {
    if (scrollPosition && scrollPosition > 80 && !loading) {
      postGetter();
    }
  }, [loading, scrollPosition, postGetter]);

  // dismount before async call finished
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  return (
    <section className="grid grid-cols-1 gap-0">
      <Image
        alt="home-text"
        className="px-4 py-24"
        src="/header-text.png"
        width="2415"
        height="1564"
      />
      {posts.map((post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </section>
  );
}

export default Posts;