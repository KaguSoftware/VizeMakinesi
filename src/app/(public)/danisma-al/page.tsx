import type { Metadata } from "next";
import DanismaAlForm from "./DanismaAlForm";
import { getDanismaCountries } from "@/lib/data/countries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Danışma Al — Vize Makinesi",
  description: "Seyahat planınızı ve vize ihtiyacınızı paylaşın, danışmanlarımız en geç 2 iş günü içinde size dönsün.",
};

export default async function DanismaAlPage() {
  const countries = await getDanismaCountries();
  return <DanismaAlForm countries={countries} />;
}
