import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bakimim.com';

  const blogPosts = [
    "yetkili-vs-ozel-servis",
    "ankara-toyota-chr-batarya-degisim-maliyeti",
    "istanbul-clio-triger-seti-degisim-ucreti",
    "izmir-vw-golf-bakim-ucretleri",
    "adana-egea-servis-maliyetleri",
    "chery-tiggo-bakim-araliklari-fiyatlari",
    "honda-civic-cvt-sanziman-yagi-degisimi",
    "ford-focus-dpf-iptali-temizligi",
    "bmw-320i-g20-fren-balata-maliyetleri",
    "peugeot-3008-adblue-arizasi-cozumu",
    "hyundai-i20-vs-bayon-bakim-karsilastirmasi",
    "mercedes-c200-periyodik-bakim-a-ve-b",
    "lpg-bakimi-fiyatlari-2026",
    "kis-lastigi-degisim-balans-ucretleri",
    "oto-ekspertiz-dolandiriciligi"
  ];

  const blogUrls = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogUrls,
  ];
}
