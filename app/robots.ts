import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Ana domainimizi buraya tanımlıyoruz
  const baseUrl = 'https://www.bakimim.com'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
