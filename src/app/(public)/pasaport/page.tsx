import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import PassportRow from '@/components/passport/PassportRow/PassportRow';

export const metadata: Metadata = {
  title: 'Pasaport Hizmetleri — Vize Makinesi',
  description: 'Yeni pasaport, yenileme, kayıp veya çalıntı ve çocuk pasaportu işlemleri.',
};

export default function PassportPage() {
  return (
    <>
      <PageHead
        eyebrow="— Pasaport hizmetleri"
        title={<>Vizeden <em className="font-normal italic text-coral">önce</em> gelen belge.</>}
        lede="İlk çıkarma, yenileme, kayıp ve çocuk başvuruları dahil her pasaport durumunu vize çalışmamızla aynı titizlikle yönetiriz."
      />
      <section className="container pt-6">
        <PassportRow />
      </section>
    </>
  );
}
