import { MetadataRoute } from 'next';
    import generateSitemapArray from '../generateSitemapArray'; // Import from the renamed file

    // THIS IS THE CRUCIAL FIX FOR THE ERROR
    export const dynamic = 'force-static';

    export async function GET() {
      const sitemapEntries: MetadataRoute.Sitemap = await generateSitemapArray();

      // Ensure BASE_URL is consistent or fetched from environment for constructing full URLs
      // The generateSitemapArray already uses absolute URLs, so we just need to format them.
      // If generateSitemapArray returned relative URLs, you'd use a base URL here.

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapEntries.map(entry => {
        // Entry URLs should already be absolute from generateSitemapArray
        const lastModString = entry.lastModified
          ? (entry.lastModified instanceof Date ? entry.lastModified.toISOString() : new Date(entry.lastModified).toISOString())
          : '';
        const changeFreqString = entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : '';
        const priorityString = entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : '';

        return `
          <url>
            <loc>${entry.url}</loc>
            ${lastModString ? `<lastmod>${lastModString}</lastmod>` : ''}
            ${changeFreqString}
            ${priorityString}
          </url>
        `;
      }).join('')}
    </urlset>`;

      return new Response(sitemapXml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      });
    }
