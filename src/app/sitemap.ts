// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

// Define the base URL for your website.
// This is crucial for generating absolute URLs in the sitemap.
const BASE_URL = 'https://www.officiax.com';

/**
* Generates the sitemap for the OfficiaX website.
* This function is automatically picked up by Next.js to create the sitemap.xml.
*
* @returns {MetadataRoute.Sitemap} An array of sitemap entries.
*/
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Define static pages that don't change often.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`, // Home page
      lastModified: new Date(), // Set to the last time this page content was modified
      changeFrequency: 'weekly', // How often the content is likely to change
      priority: 1, // Higher priority for important pages (0.0 to 1.0)
    },
    {
      url: `${BASE_URL}/ai-assistant`, // AI Assistant page
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/leagues`, // Leagues overview page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/schedule`, // Schedule page
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/toolbox`, // Toolbox page
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`, // Login page
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`, // Signup page
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`, // Privacy Policy page
      lastModified: new Date(), // Set to the last time this page content was modified
      changeFrequency: 'yearly', // Privacy policies don't change often
      priority: 0.6, // Important for compliance
    },
    // Add other static pages as needed
    // Example: { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    // Example: { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // --- Example of how to include dynamic content from a database (Firestore) ---
  // For this to work, you'll need to fetch your dynamic data.
  // This is a placeholder and assumes you have a way to fetch your league data.
  // Replace with your actual data fetching logic.

  let dynamicLeaguePages: MetadataRoute.Sitemap = [];
  try {
    // IMPORTANT: Replace this with your actual Firestore data fetching logic.
    // For example, if you have a 'leagues' collection in Firestore:
    /*
    import { collection, getDocs } from 'firebase/firestore';
    import { db } from '@/lib/firebase'; // Assuming you have your firebase client initialized here

    const leaguesCollectionRef = collection(db, 'leagues');
    const querySnapshot = await getDocs(leaguesRef);
    const leagues = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    dynamicLeaguePages = leagues.map(league => ({
      url: `${BASE_URL}/leagues/${league.id}`, // Assuming league.id is your dynamic segment
      lastModified: league.updatedAt ? new Date(league.updatedAt.toDate()) : new Date(), // Use a timestamp from your data if available
      changeFrequency: 'daily', // Leagues might update frequently with new info
      priority: 0.8,
    }));
    */

    // Placeholder for demonstration:
    const mockLeagues = [
      { id: 'ayba', name: 'AYBA League' },
      { id: 'nfhs', name: 'NFHS Rules' },
      { id: 'oceepark', name: 'Ocee Park Venues' },
      { id: 'perfectgame', name: 'Perfect Game' },
      { id: 'traininglegends', name: 'Training Legends' },
    ];

    dynamicLeaguePages = mockLeagues.map(league => ({
      url: `${BASE_URL}/leagues/${league.id}`,
      lastModified: new Date(), // In a real app, fetch this from your data
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Example for dynamic sub-pages within leagues (e.g., field status, rules)
    // You would fetch these dynamically as well.
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
    // In a production environment, you might want to log this error
    // or use a monitoring service. For sitemap generation, it's often
    // acceptable to proceed with only static pages if dynamic data fails.
  }

  // Combine all sitemap entries
  return [...staticPages, ...dynamicLeaguePages];
}

// If you are encountering parsing errors on the 'import' statement,
// please ensure your Next.js version is up-to-date (v13.3 or higher for MetadataRoute in App Router)
// and that your TypeScript and build configurations are correctly set up for ES Modules.
// Sometimes, re-saving the file or restarting your development server can also resolve transient parsing issues.
