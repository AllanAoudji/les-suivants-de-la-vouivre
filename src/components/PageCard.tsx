import Link from 'next/link';

import 'moment/locale/fr';

type Props = {
  page: Page;
};

function PageCard({ page }: Props) {
  return (
    <Link
      className="duration-1000 transition hover:text-dark"
      href={`/page/${page.slug}`}
    >
      {page.name.toLocaleUpperCase()}
    </Link>
  );
}

export default PageCard;
