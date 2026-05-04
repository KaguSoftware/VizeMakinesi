import Nav from './Nav';
import { getMegaMenu } from '@/lib/data/megaMenu';
import { getMarqueeItems } from '@/lib/data/marquee';

export default async function NavServer() {
  const [dbCategories, tickerItems] = await Promise.all([
    getMegaMenu(),
    getMarqueeItems('nav_ticker'),
  ]);

  return <Nav dbCategories={dbCategories} tickerItems={tickerItems} />;
}
