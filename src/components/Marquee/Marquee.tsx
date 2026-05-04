import { MARQUEE_ITEMS } from './constants';

export default function Marquee() {
  return (
    <section className="border-t border-b border-border bg-cream py-8 overflow-hidden text-coral mt-16">
      <div className="strip-track font-serif">
        {[0, 1].map((setIdx) => (
          <div key={setIdx} className="strip-set" aria-hidden={setIdx === 1 ? true : undefined}>
            {MARQUEE_ITEMS.map((item, i) => (
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
        ))}
      </div>
    </section>
  );
}
