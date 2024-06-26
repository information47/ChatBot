import { Bot } from './types';

const helpCommand = async (): Promise<string> => {
    // return the help message for all the bots
    return bots.map(bot => `<b>${bot.name}</b>:<br> ${bot.help}`).join('<br><br> ');
};

function filterLinksFromResponse(response: string): string {
    // remove <a> tags and their content from the response
    return response.replace(/<a[^>]*>([^<]+)<\/a>/gi, '');
}

const buildWeatherUrl = (location: string, days: string = '0'): string => `https://wttr.in/${location}?nq${days}&lang=en`;

const buildMoonPhaseUrl = (): string => 'https://wttr.in/?format=%m';

const processWeatherResponse = async (url: string): Promise<string> => {
    const response = await fetch(url);
    return response.text();
};

const createBot = (
    name: string, 
    avatar: string, 
    actions: Record<string, (message: string) => Promise<string>>, 
    help: string): Bot => {
    return {
        name,
        avatar,
        actions,
        help,
    };
}

const MeteoBot = createBot(
    'MeteoMan',
    'meteo.png',
    {
        weather: async (args: string): Promise<string> => {
            if (!args) {
                return 'Please provide a location';
            }
            const splittedArgs: string[] = args.split(' ');
            const url = buildWeatherUrl(splittedArgs[0], splittedArgs[1] ? splittedArgs[1] : '0');
            return filterLinksFromResponse(await processWeatherResponse(url));
        },
        help: helpCommand,
        moon: async (): Promise<string> => {
            const url = buildMoonPhaseUrl();
            const moonPhase = await processWeatherResponse(url);
            return "Today's moon phase: " + moonPhase;
        }
    },
    `
    - <u>weather</u> [city_name]<br>
    &nbsp Get the weather for the given city<br><br>
    - <u>weather</u> [city_name] [days_number]<br>
    &nbsp Get the weather for the given city for the next (1-3) days<br><br>
    - <u>moon</u><br>
    &nbsp Get the moon phase<br><br>
    `
);

const JokerBot = createBot(
    'Joker',
    'clown.png',
    {
        joke: async (): Promise<string> => {
            const response = await fetch('https://api.chucknorris.io/jokes/random');
            const data = await response.json();
            return data.value;
        },
        help: helpCommand,
    },
    `
    - <u>joke</u><br>
    &nbsp Get a random joke<br><br>
    `
);  

export const bots: Bot[] = [JokerBot, MeteoBot];
