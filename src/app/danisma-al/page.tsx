import type { Metadata } from "next";
import DanismaAlForm from "./DanismaAlForm";

export const metadata: Metadata = {
  title: "Danışma Al — Vize Makinesi",
  description: "Seyahat planınızı ve vize ihtiyacınızı paylaşın, danışmanlarımız en geç 1 iş günü içinde size dönsin.",
};

export default function DanismaAlPage() {
  return <DanismaAlForm />;
}
