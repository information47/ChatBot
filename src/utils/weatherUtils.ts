export const buildWeatherUrl = (location: string, days: string = '0'): string => 
    `https://wttr.in/${location}?nq${days}&lang=en`;
  
export const buildMoonPhaseUrl = (): string => 
  'https://wttr.in/?format=%m';
  
export const processWeatherResponse = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    return response.text();
  } catch (error) {
    // Gérer l'erreur ou la propager
    throw new Error('Failed to fetch weather data');
  }
};