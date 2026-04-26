import { MARQUEE_ITEMS } from './constants';

export default function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="border-t border-b border-border bg-cream py-8 overflow-hidden">
      <div className="strip-track font-serif">
        {doubled.map((item, i) => (
          <>
            {item.italic ? (
              <em key={`text-${i}`}>{item.text}</em>
            ) : (
              <span key={`text-${i}`}>{item.text}</span>
            )}
            <span key={`dot-${i}`} className="text-coral mx-3 not-italic text-sm">
              —
            </span>
          </>
        ))}
      </div>
    </section>
  );
}
