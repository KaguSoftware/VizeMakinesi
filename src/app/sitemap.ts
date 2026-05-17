import type { MetadataRoute } from "next";
import { getCountrySlugsStatic, getTourismSlugsStatic } from "@/lib/data/countries";
import { SCHENGEN_SLUG_MAP } from "@/data/schengen";

const SITE_URL = "https://vizemakinesi.com";

const STATIC_ROUTES = [
    "",
    "/vizeler",
    "/hakkimizda",
    "/ekibimiz",
    "/ortakliklar",
    "/pasaport",
    "/vize-turleri",
    "/ucrete-dahil-hizmetler",
    "/abd-hizlandirma",
    "/nasil-calisiyoruz",
    "/iletisim",
    "/danisma-al",
    "/blog",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const [countrySlugs, blogSlugs] = await Promise.all([
        getCountrySlugsStatic(),
        getTourismSlugsStatic(),
    ]);

    const dbCountrySet = new Set(countrySlugs);
    const schengenStubs = [...SCHENGEN_SLUG_MAP.keys()].filter((s) => !dbCountrySet.has(s));

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : 0.7,
    }));

    const countryEntries: MetadataRoute.Sitemap = [...countrySlugs, ...schengenStubs].map((slug) => ({
        url: `${SITE_URL}/vize/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
    }));

    return [...staticEntries, ...countryEntries, ...blogEntries];
}
