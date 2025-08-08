import type { MetadataRoute } from 'next';

    const BASE_URL = 'https://www.officiax.com';

    // No changes needed inside this function itself, it's already good.
    export default async function generateSitemapArray(): Promise<MetadataRoute.Sitemap> {
      const staticPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
        { url: `${BASE_URL}/ai-assistant`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/leagues`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/schedule`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/toolbox`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
      ];

      let dynamicLeaguePages: MetadataRoute.Sitemap = [];
      try {
        const mockLeagues = [
          { id: 'ayba', name: 'AYBA League' },
          { id: 'nfhs', name: 'NFHS Rules' },
          { id: 'oceepark', name: 'Ocee Park Venues' },
          { id: 'perfectgame', name: 'Perfect Game' },
          { id: 'traininglegends', name: 'Training Legends' },
        ];

        dynamicLeaguePages = mockLeagues.map(league => ({
          url: `${BASE_URL}/leagues/${league.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));

        const dynamicLeagueSubPages: MetadataRoute.Sitemap = [];
        mockLeagues.forEach(league => {
          dynamicLeagueSubPages.push({
            url: `${BASE_URL}/leagues/${league.id}/fieldstatus`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
          });
          dynamicLeagueSubPages.push({
            url: `${BASE_URL}/leagues/${league.id}/rules`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        });
        dynamicLeaguePages = dynamicLeaguePages.concat(dynamicLeagueSubPages);

      } catch (error) {
        console.error('Error generating dynamic sitemap entries:', error);
      }

      return [...staticPages, ...dynamicLeaguePages];
    }
    