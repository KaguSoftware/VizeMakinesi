import type { MetadataRoute } from "next";
import { getCountrySlugsStatic, getTourismSlugsStatic } from "@/lib/data/countries";
import { getBlogSchengenPage } from "@/lib/data/blogSchengenPage";
import { getCountryBlogParamsStatic } from "@/lib/data/countryBlog";
import { SCHENGEN_SLUG_MAP } from "@/data/schengen";
import { countryHref } from "@/lib/routes";

const SITE_URL = "https://vizemakinesi.com";

const STATIC_ROUTES = [
    "",
    "/vizeler",
    "/hakkimizda",
    "/ekibimiz",
    "/ortakliklar",
    "/ucrete-dahil-hizmetler",
    "/abd-hizlandirma",
    "/iletisim",
    "/danisma-al",
    "/blog",
    "/blog/schengen-vize-alma-rehberi",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const [countrySlugs, blogSlugs, schengenGuide, countryArticles] = await Promise.all([
        getCountrySlugsStatic(),
        getTourismSlugsStatic(),
        getBlogSchengenPage(),
        getCountryBlogParamsStatic(),
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
        url: `${SITE_URL}${countryHref(slug)}`,
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

    // Schengen rehberinin yazıları admin panelinden eklenip çıkarıldığı için
    // liste sabit değil; her seferinde içerikten okunur.
    const guideEntries: MetadataRoute.Sitemap = schengenGuide.articles.map((article) => ({
        url: `${SITE_URL}/blog/schengen-vize-alma-rehberi/${article.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    // Ülke bloglarının makaleleri de admin panelinden yönetilir.
    const countryArticleEntries: MetadataRoute.Sitemap = countryArticles.map((p) => ({
        url: `${SITE_URL}/blog/${p.countrySlug}/${p.articleSlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
    }));

    return [
        ...staticEntries,
        ...countryEntries,
        ...blogEntries,
        ...guideEntries,
        ...countryArticleEntries,
    ];
}
