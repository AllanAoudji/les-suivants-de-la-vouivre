'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getPosts, getPostsByCategory } from '@/sanity/sanity.queries';

import PostCard from './PostCard';
import LoaderButton from './LoaderButton';

type Props = {
  categorySlug?: string | null;
  posts: Post[];
  showCategories?: boolean;
  showHeaderText?: boolean;
};

const NUM_OF_POST_BY_BATCH = 12;

function Posts({
  categorySlug = null,
  posts: initialPost,
  showCategories = true,
}: Props) {
  // TODO: need to catch id initialPost.length === 0
  const [lastPublishedAt, setLastPublishedAt] = useState<string>(
    initialPost.length ? initialPost[initialPost.length - 1].publishedAt : ''
  );
  const [lastSlug, setLastSlug] = useState<string | null>(
    initialPost.length < NUM_OF_POST_BY_BATCH
      ? null
      : initialPost[initialPost.length - 1].slug
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>(initialPost);

  const mountedRef = useRef<boolean>(true);

  const postsGetter = useCallback(async () => {
    if (lastSlug == null || loading) return;

    setLoading(true);

    let result: Post[];

    if (categorySlug) {
      result = await getPostsByCategory(
        lastPublishedAt,
        lastSlug,
        categorySlug
      );
    } else {
      result = await getPosts(lastPublishedAt, lastSlug);
    }

    if (!mountedRef.current) return;

    setPosts((prevState) => [...prevState, ...result]);
    if (result.length < NUM_OF_POST_BY_BATCH) {
      setLastSlug(null);
    } else {
      setLastSlug(result[result.length - 1].slug);
      setLastPublishedAt(result[result.length - 1].publishedAt);
    }

    setLoading(false);
  }, [categorySlug, lastPublishedAt, lastSlug, loading]);

  // dismount before async call finished
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  return (
    <>
      {posts.map((post, i) => (
        <PostCard
          key={post._id}
          post={post}
          showCategories={showCategories}
          variant={i < 4 ? 'normal' : 'small'}
        />
      ))}
      <LoaderButton
        className="col-span-1 flex items-center justify-center pt-20 text-light text-xl sm:col-span-2 lg:col-span-3"
        loading={loading}
        onClick={postsGetter}
        show={!!lastSlug}
      >
        Voir plus d&apos;articles
      </LoaderButton>
    </>
  );
}

export default Posts;
