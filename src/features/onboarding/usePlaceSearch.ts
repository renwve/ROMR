import { useEffect, useState } from 'react';

// Google Places autocomplete for countries, regions and cities, as the banana
// branch's onboarding had it. The key comes from EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
// (in .env.local, which git ignores).
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
// Waits for a pause in typing before searching.
const DEBOUNCE_MS = 300;
export const MIN_QUERY = 2;

export type PlaceSuggestion = { id: string; name: string };

type AutocompleteResponse = {
  suggestions?: {
    placePrediction?: { placeId: string; text?: { text: string } };
  }[];
};

// The latest suggestions found for what's been typed. They're kept after the
// text is cleared (so a closing dropdown keeps its rows), and searching only
// starts from two characters. A failed search finds nothing.
export function usePlaceSearch(query: string) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < MIN_QUERY) return;
    if (!GOOGLE_API_KEY) {
      console.warn('Destination search needs EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(AUTOCOMPLETE_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_API_KEY,
            'X-Goog-FieldMask':
              'suggestions.placePrediction.placeId,suggestions.placePrediction.text',
          },
          body: JSON.stringify({
            input: trimmed,
            includedPrimaryTypes: ['country', 'locality', 'administrative_area_level_1'],
          }),
        });
        if (!response.ok) throw new Error(`Places search failed (${response.status})`);
        const result: AutocompleteResponse = await response.json();
        setSuggestions(
          (result.suggestions ?? []).flatMap(({ placePrediction: place }) =>
            place?.text ? [{ id: place.placeId, name: place.text.text }] : [],
          ),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn(error);
        setSuggestions([]);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  return suggestions;
}
