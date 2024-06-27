import { Bot } from './types';
import { buildWeatherUrl, processWeatherResponse, buildMoonPhaseUrl } from './utils/weatherUtils';
import { buildJokeUrl } from './utils/jokeUtils';
import { buildMovieUrl} from './utils/movieUtils';

function filterLinksFromResponse(response: string): string {
    // remove <a> tags and their content from a string
    return response.replace(/<a[^>]*>([^<]+)<\/a>/gi, '');
}

const createBot = (
    name: string,
    avatar: string,
    actions: Record<string, (message: string) => Promise<string>>,): Bot => {
    return {
        name,
        avatar,
        actions,
    };
}

const WeatherBot = createBot(
    'WeatherBot',
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
        help: async (): Promise<string> => {
            return `
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
            `;
        },
        moon: async (): Promise<string> => {
            const url = buildMoonPhaseUrl();
            const moonPhase = await processWeatherResponse(url);
            return "Today's moon phase: " + moonPhase;
        }
    },
);

const JokerBot = createBot(
    'JokeBot',
    'clown.png',
    {
        joke: async (args: string): Promise<string> => {
            const response = await fetch(buildJokeUrl(args));
            const data = await response.json();
            if (data.error) {
                return 'I have no jokes for you with these parameters...';
            }
            return data.type == "single" ? data.joke : data.setup + '<br>' + data.delivery;
        },
        help: async (): Promise<string> => {
            return `
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
            `;
        },
    },
);

const MovieBot = createBot(
    'MovieBot',
    'movie.png',
    {
        movietop: async (): Promise<string> => {
            const url = buildMovieUrl('movie/top_rated');
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 9){
                 return "<u>Here are the 10 top rated movies:</u><br><br><ul>" + data.results.slice(0,10).map((movie: { title: string; }) => "<li>" + movie.title + "</li>").join('<br>') + "</ul><br>For more information please type: movie [movie name]";
            }
            else {
                return "Here are the top rated movies:<br>" + data.results.map((movie: { title: string; }) => movie.title).join('<br>');
            }
        },
        movie: async (args: string): Promise<string> => {
            if (!args) {
                return 'Please provide a movie name';
            }
            const url = buildMovieUrl('search/movie', { query: args });
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length === 0) {
                return 'No movie found with this name';
            }
            const movie = data.results[0];
            const overview = movie.overview;
            return overview;
        },
        help: async (): Promise<string> => {
            return `
            - <u>movie</u> [movie_name]<br>
            &nbsp Get the overview of the given movie<br><br>
            - <u>movieTop</u><br>
            &nbsp Get the top rated movies<br><br>
            examples:<br>
            &nbsp movie Inception<br>
            &nbsp movietop<br>
            `;
        },
    },
);

export const bots: Bot[] = [JokerBot, WeatherBot, MovieBot];
