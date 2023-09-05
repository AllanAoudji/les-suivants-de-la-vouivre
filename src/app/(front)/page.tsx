import PageContainer from '@src/components/PageContainer';
import Posts from '@src/components/Posts';
import { getPosts } from '@/sanity/sanity.queries';
import HomeHeader from '@src/components/HomeHeader';
import HomeAbout from '@src/components/HomeAbout';
import { bodoniModa } from '@src/utils/fonts';
import InstaFeeds from '@src/components/InstaFeeds';

type Props = {
  searchParams: {
    drawer: string | undefined;
  };
};

export default async function Home({ searchParams: { drawer } }: Props) {
  const headerPost = await getPosts(new Date().toISOString(), '', {
    numToFetch: 5,
  });
  let posts: Post[] = [];

  if (headerPost.length) {
    posts = await getPosts(new Date().toISOString(), '');
  }

  return (
    <PageContainer
      header={
        <>
          <HomeHeader posts={headerPost} />
          <HomeAbout />
        </>
      }
      footer={<InstaFeeds />}
      drawer={drawer}
    >
      <h4
        className={`text-light pt-16 pb-12 text-5xl uppercase ${bodoniModa.className}`}
      >
        Les derniers articles
      </h4>
      <div className="grid grid-cols-1 gap-0 pb-20">
        <Posts posts={posts} />
      </div>
    </PageContainer>
  );
}
