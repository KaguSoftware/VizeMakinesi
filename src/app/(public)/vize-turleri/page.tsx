import type { Metadata } from "next";
import { getAllCountriesSlim } from "@/lib/data/countries";
import CountrySearch from "@/components/vizeTurleri/CountrySearch";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Genel Vize Türleri",
    description: "Turistik, ticari, aile ziyareti, aile birleşimi, öğrenci, çalışma, transit ve etkinlik vizeleri hakkında genel bilgi.",
};

const VIZE_TURLERI = [
    {
        icon: '🏖️',
        tag: 'Tip C',
        title: 'Turistik Vize',
        desc: 'Gezi, tatil ve bireysel seyahatler için 180 gün içinde en fazla 90 güne kadar kalış hakkı sağlayan kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '💼',
        tag: 'Tip C',
        title: 'Ticari Vize',
        desc: 'İş görüşmesi, toplantı ve fuar gibi ticari organizasyonlara katılmak için başvurulan kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '👨‍👩‍👧',
        tag: 'Tip C',
        title: 'Aile Ziyareti Vizesi',
        desc: 'Yakınlarını veya aile bireylerini ziyaret etmek amacıyla davetiye ile başvurulan kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '🏠',
        tag: 'Tip D',
        title: 'Aile Birleşimi Vizesi',
        desc: 'Yasal olarak ikamet eden aile bireylerinin yanına kalıcı olarak yerleşmek amacıyla başvurulan uzun süreli D tipi ulusal vizedir.',
    },
    {
        icon: '🎓',
        tag: 'Tip D',
        title: 'Öğrenci Vizesi',
        desc: 'Üniversite veya dil kursu gibi uzun süreli eğitim programlarına katılacak kişilerin aldığı uzun süreli D tipi ulusal vizedir.',
    },
    {
        icon: '🛠️',
        tag: 'Tip D',
        title: 'Çalışma Vizesi',
        desc: 'Bir ülkede yasal olarak istihdam edilmek ve çalışmak üzere resmi belgelerle başvurulan uzun süreli D tipi ulusal vizedir.',
    },
    {
        icon: '🔄',
        tag: 'Tip C',
        title: 'Transit Vizesi',
        desc: 'Bir ülkenin topraklarından geçerek başka bir ülkeye seyahat edecek yolcuların ihtiyaç duyduğu kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '🎤',
        tag: 'Tip C',
        title: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi',
        desc: 'Uluslararası kongre, konferans, bilimsel veya kültürel etkinliklere katılacak kişilerin aldığı kısa süreli C tipi Schengen vizesidir.',
    },
];

export default async function VizeTurleriPage() {
    const countries = await getAllCountriesSlim();

    return (
        <div className="container mt-20 mb-24">
            <div className="border-b border-border pb-7 mb-10">
                <h1 className="font-serif font-bold text-[clamp(24px,3.5vw,48px)] leading-none tracking-tight text-navy">
                    Genel Vize <em className="font-normal italic text-coral">Türleri</em>
                </h1>
            </div>

            <div className="mb-14">
                <CountrySearch countries={countries} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {VIZE_TURLERI.map((tur) => (
                    <div
                        key={tur.title}
                        className="flex flex-col gap-4 p-6 rounded-2xl border border-navy/10 bg-white hover:border-coral/30 hover:bg-coral/5 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-lg">
                                {tur.icon}
                            </div>
                            <span className="font-mono text-[10px] tracking-widest uppercase text-coral border border-coral/30 bg-coral/8 rounded-md px-2 py-0.5">
                                {tur.tag}
                            </span>
                        </div>
                        <div>
                            <p className="font-sans font-semibold text-[14px] text-navy mb-2">{tur.title}</p>
                            <p className="font-sans text-[13px] text-navy/55 leading-relaxed">{tur.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
