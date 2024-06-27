import { Bot } from './types';
import { buildWeatherUrl, processWeatherResponse, buildMoonPhaseUrl } from './utils/weatherUtils';
import{ buildJokeUrl } from './utils/jokeUtils';

const helpCommand = async (): Promise<string> => {
    // return the help message for all the bots
    return bots.map(bot => `<b>${bot.name}</b>:<br> ${bot.help}`).join('<br><br> ');
};

function filterLinksFromResponse(response: string): string {
    // remove <a> tags and their content from a string
    return response.replace(/<a[^>]*>([^<]+)<\/a>/gi, '');
}

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
    'WeatherMan',
    'weather.png',
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
    examples:<br>
    &nbsp weather Paris<br>
    &nbsp weather Paris 2<br>
    &nbsp moon<br>
    `
);

const JokerBot = createBot(
    'JokeMan',
    'clown.png',
    {
        joke: async (args: string): Promise<string> => {
            const response = await fetch(buildJokeUrl(args));
            const data = await response.json();
            if (data.error) {
                return 'I have no jokes for you with these parameters...';
            }
            return data.type == "single" ? data.joke : data.setup + '\n' + data.delivery;
        },
        help: helpCommand,
    },
    `
    - <u>joke</u><br>
    &nbsp Get a random joke<br>
    &nbsp Options:<br>
    &nbsp &nbsp [ "WordToInclude" ]<br>
    &nbsp &nbsp (1max)<br><br>
    &nbsp &nbsp [ -FlagToBlacklist ]<br>
    &nbsp &nbsp &nbsp (racist, sexist, explicit, political, religious, nsfw)<br><br>
    &nbsp &nbsp [ Category1 Category2 ... ]<br>
    &nbsp &nbsp (Any, Misc, Programming, Dark, Pun, Spooky, Christmas)<br><br>
    examples:<br>
    &nbsp joke "chicken" -racist -sexist Any<br>
    &nbsp joke<br>
    &nbsp joke programming<br>
    `
);  

export const bots: Bot[] = [JokerBot, MeteoBot];
