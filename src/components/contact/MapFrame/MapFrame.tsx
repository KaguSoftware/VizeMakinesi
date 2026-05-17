import { MAP_NOTE } from './constants';
import { FadeIn } from '@/components/shared/motion';

export default function MapFrame() {
  return (
    <>
      <FadeIn as="div" className="w-full aspect-[4/3] border border-border overflow-hidden" duration={0.55}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12030.868584818221!2d28.986572799999994!3d41.075175099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e81a222eb1%3A0x2f1a03e8a184187c!2sGezi%20Makinesi!5e0!3m2!1str!2str!4v1777289724778!5m2!1str!2str"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </FadeIn>
      <FadeIn as="p" delay={0.1} className="text-[13px] text-muted mt-4 leading-[1.7]">{MAP_NOTE}</FadeIn>
    </>
  );
}
