
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure dotenv has loaded environment variables, typically done in dev.ts
// For production, these should be set in the environment itself.
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey && process.env.NODE_ENV === 'development') {
  console.warn(
    'GEMINI_API_KEY is not set in the environment. Genkit Google AI plugin might not work.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey, // Explicitly pass the API key
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
