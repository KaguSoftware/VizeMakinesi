import { MARQUEE_ITEMS } from './constants';

export default function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="border-t border-b border-border bg-cream py-8 overflow-hidden">
      <div className="strip-track font-serif">
        {doubled.map((item, i) => (
          <span key={i} className="contents">
            {item.italic ? (
              <em>{item.text}</em>
            ) : (
              <span>{item.text}</span>
            )}
            <span className="text-coral mx-3 not-italic text-sm">—</span>
          </span>
        ))}
      </div>
    </section>
  );
}
