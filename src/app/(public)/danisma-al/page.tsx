import type { Metadata } from "next";
import DanismaAlForm from "./DanismaAlForm";
import { isRequestType } from "./requestSummary";
import { getDanismaCountries } from "@/lib/data/countries";

export const metadata: Metadata = {
  title: "Danışma Al — Vize Makinesi",
  description: "Seyahat planınızı ve vize ihtiyacınızı paylaşın, danışmanlarımız en geç 2 iş günü içinde size dönsün.",
};

export default async function DanismaAlPage({
  searchParams,
}: {
  // `?tip=hizlandirma` preselects the ABD expedite flow — that's how the
  // /abd-hizlandirma CTA lands here. Reading it makes the page dynamic.
  searchParams: Promise<{ tip?: string }>;
}) {
  const [countries, { tip }] = await Promise.all([getDanismaCountries(), searchParams]);
  return (
    <DanismaAlForm countries={countries} initialType={isRequestType(tip) ? tip : "vize"} />
  );
}
