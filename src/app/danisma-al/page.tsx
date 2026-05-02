import type { Metadata } from "next";
import DanismaAlForm from "./DanismaAlForm";

export const metadata: Metadata = {
  title: "Danışma Al — Vize Makinesi",
  description: "Seyahat planınızı ve vize ihtiyacınızı paylaşın, danışmanlarımız en geç 2 iş günü içinde size dönsün.",
};

export default function DanismaAlPage() {
  return <DanismaAlForm />;
}
