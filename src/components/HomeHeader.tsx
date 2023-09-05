'use client';

import 'moment/locale/fr';

import { AnimatePresence, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import HomeHeaderCategories from './HomeHeaderCategories';
import HomeHeaderTitle from './HomeHeaderTitle';
import HomeHeaderImage from './HomeHeaderImage';
import HomeHeaderPublishedAt from './HomeHeaderPublishedAt';
import HomeHeaderNavigation from './HomeHeaderNavigation';

type Props = {
  posts: Post[];
};

const ANIMATION_DELAY = 0.2;
const ANIMATION_SPEED = 0.7;
const TIMER_SPEED = 6;
const X_IMAGE_ANIMATION = 90;
const Y_TITLE_ANIMATION = 100;
const Y_CATEGORIES_ANIMATION = 50;

function HomeHeader({ posts }: Props) {
  const [index, setIndex] = useState(0);
  const [canPress, setCanPress] = useState(true);

  const constrolsCategories = useAnimationControls();
  const controlsImage = useAnimationControls();
  const controlsPublishedAt = useAnimationControls();
  const controlsTitle = useAnimationControls();

  const intervalRef = useRef<NodeJS.Timer | null>();

  const clearTimer = useCallback(() => {
    if (!intervalRef.current) {
      return;
    }
    clearInterval(intervalRef.current);
  }, []);

  const decreaseIndex = useCallback(async () => {
    if (!canPress) {
      return;
    }
    setCanPress(false);
    await Promise.all([
      constrolsCategories.start({
        opacity: 0,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
        },
        y: Y_CATEGORIES_ANIMATION,
      }),
      controlsImage.start({
        opacity: 0,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
        },
        x: -X_IMAGE_ANIMATION,
      }),
      controlsPublishedAt.start({
        opacity: 0,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
        },
        y: Y_CATEGORIES_ANIMATION,
      }),
      controlsTitle.start({
        opacity: 0,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY,
          duration: ANIMATION_SPEED,
        },
        y: Y_TITLE_ANIMATION,
      }),
    ]);
    setIndex((prevState) =>
      prevState - 1 < 0 ? posts.length - 1 : prevState - 1
    );
    controlsImage.set({ x: X_IMAGE_ANIMATION });
    await Promise.all([
      constrolsCategories.start({
        opacity: 1,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY * 2,
          duration: ANIMATION_SPEED,
        },
        y: 0,
      }),
      controlsImage.start({
        opacity: 1,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY,
          duration: ANIMATION_SPEED,
        },
        x: 0,
      }),
      controlsPublishedAt.start({
        opacity: 1,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY * 2,
          duration: ANIMATION_SPEED,
        },
        y: 0,
      }),
      controlsTitle.start({
        opacity: 1,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED * 2,
          delay: ANIMATION_DELAY,
        },
        y: 0,
      }),
    ]);
    setCanPress(true);
  }, [
    canPress,
    constrolsCategories,
    controlsImage,
    controlsPublishedAt,
    controlsTitle,
    posts,
  ]);

  const increaseIndex = useCallback(async () => {
    if (!canPress) {
      return;
    }
    setCanPress(false);
    await Promise.all([
      constrolsCategories.start({
        opacity: 0,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
        },
        y: Y_CATEGORIES_ANIMATION,
      }),
      controlsImage.start({
        opacity: 0,
        x: X_IMAGE_ANIMATION,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
        },
      }),
      controlsPublishedAt.start({
        opacity: 0,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
        },
        y: Y_CATEGORIES_ANIMATION,
      }),
      controlsTitle.start({
        opacity: 0,
        y: Y_TITLE_ANIMATION,
        transition: {
          bounce: false,
          duration: ANIMATION_SPEED,
          delay: ANIMATION_DELAY,
        },
      }),
    ]);
    setIndex((prevState) => (prevState + 1) % posts.length);
    controlsImage.set({ x: -X_IMAGE_ANIMATION });
    await Promise.all([
      constrolsCategories.start({
        opacity: 1,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY * 2,
          duration: ANIMATION_SPEED,
        },
        y: 0,
      }),
      controlsImage.start({
        opacity: 1,
        x: 0,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY,
          duration: ANIMATION_SPEED,
        },
      }),
      controlsPublishedAt.start({
        opacity: 1,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY * 2,
          duration: ANIMATION_SPEED,
        },
        y: 0,
      }),
      controlsTitle.start({
        opacity: 1,
        y: 0,
        transition: {
          bounce: false,
          delay: ANIMATION_DELAY * 2,
          duration: ANIMATION_SPEED,
        },
      }),
    ]);
    setCanPress(true);
  }, [
    canPress,
    constrolsCategories,
    controlsPublishedAt,
    controlsImage,
    controlsTitle,
    posts,
  ]);

  const setTimer = useCallback(() => {
    const timer = setInterval(increaseIndex, TIMER_SPEED * 1000);
    intervalRef.current = timer;
  }, [increaseIndex]);

  const resetTimer = useCallback(() => {
    if (!posts.length) {
      return;
    }
    clearTimer();
    setTimer();
  }, [clearTimer, setTimer, posts]);

  const handlePressNext = useCallback(() => {
    increaseIndex();
    resetTimer();
  }, [increaseIndex, resetTimer]);

  const handlePressPrevious = useCallback(() => {
    decreaseIndex();
    resetTimer();
  }, [decreaseIndex, resetTimer]);

  useEffect(() => {
    resetTimer();
    return () => {
      clearTimer();
    };
  }, [resetTimer, clearTimer]);

  useEffect(() => {
    controlsImage.set({ x: 0, opacity: 1 });
    controlsTitle.set({ y: 1, opacity: 1 });
  }, [controlsImage, controlsTitle]);

  if (!posts.length) {
    return;
  }

  return (
    <div className="h-[calc(100vh-5rem)] max-h-[calc(190vw-5rem)] transition-all sm:mb-52 overflow-hidden px-6">
      <div className="h-full overflow-hidden relative w-full">
        <AnimatePresence>
          <HomeHeaderCategories
            animate={constrolsCategories}
            categories={posts[index].categories}
            className="left-0 pl-14 py-3 text-sm top-3 w-full"
          />
          <HomeHeaderTitle
            animate={controlsTitle}
            className="py-3 text-4xl top-9"
            title={posts[index].title}
          />
          <HomeHeaderImage
            animate={controlsImage}
            className="pl-14 top-36 w-full"
            image={posts[index].mainImage}
            imageClassName="h-[calc(100vh-19rem)] max-h-[calc(190vw-19rem)]"
            slug={posts[index].slug}
            title={posts[index].title}
          />
          <HomeHeaderPublishedAt
            animate={controlsPublishedAt}
            className="bottom-20 left-10 origin-bottom-left -rotate-90 text-xs"
            publishedAt={posts[index].publishedAt}
          />
          <HomeHeaderNavigation
            className="bottom-0 h-20 pl-14 w-full"
            index={index}
            onClickNext={handlePressNext}
            onClickPrevious={handlePressPrevious}
            postsLength={posts.length}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HomeHeader;
