import { instagramAccessToken } from '@/lib/environment';
import { bodoniModa } from '@src/utils/fonts';
import Image from 'next/image';

type Data =
  | {
      id: string;
      media_type: 'IMAGE' | 'CAROUSEL_ALBUM';
      media_url: string;
    }
  | {
      id: string;
      media_type: 'VIDEO';
      media_url: string;
      thumbnail_url: string;
    };

type InstaFeeds = {
  data: Data[];
  paging: {
    cursors: {
      after: string;
      before: string;
    };
    next: string;
  };
};

const INSTAGRAM_LINK = 'https://www.instagram.com/allanjouannet/';

export const revalidate = 3600;

async function getData(): Promise<InstaFeeds> {
  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url&limit=4&access_token=${instagramAccessToken}`
  );

  return res.json();
}

async function InstaFeeds() {
  try {
    const data = await getData();

    if (!data.data.length) {
      return null;
    }

    return (
      <div className="bg-light pb-16">
        <div className="flex items-center justify-center py-16">
          <h4
            className={`font-bold px-6 text-3xl text-center ${bodoniModa.className}`}
          >
            Suivez le projet sur{' '}
            <a
              className="border-b-4 border-secondary font-black text-secondary"
              href={INSTAGRAM_LINK}
              target="_blank"
            >
              Instagram
            </a>
          </h4>
        </div>
        <a
          className="gap-1 grid grid-cols-2 px-2 sm:grid-cols-4 sm:gap-3"
          href={INSTAGRAM_LINK}
          target="_blank"
        >
          {data.data.map((post) => (
            <div
              className="aspect-square bg-secondary grow relative"
              key={post.id}
            >
              <Image
                alt="image"
                className="object-cover"
                fill
                src={
                  post.media_type === 'VIDEO'
                    ? post.thumbnail_url
                    : post.media_url
                }
                sizes="40vw"
              />
            </div>
          ))}
        </a>
      </div>
    );
  } catch (e) {
    return null;
  }
}

export default InstaFeeds;
