const apiKey = import.meta.env.VITE_TMDBapiKey;
const apiUrl = import.meta.env.VITE_movieUrl;

export const buildMovieUrl = (path: string, queryParams: Record<string, string> = {}): string => {
    const query = new URLSearchParams({ ...queryParams, api_key: apiKey }).toString();
    return `${apiUrl}${path}?${query}`;
};