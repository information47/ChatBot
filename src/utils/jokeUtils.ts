export const buildJokeUrl1 = (category: string, blacklist: string, searchWord: string) => {
    return `https://v2.jokeapi.dev/joke/${category}${blacklist}`;
};

export function extractWordsWithDash(input: string): string {
    //regex to find all words preceded by "-"
    const matches = input.match(/-\b\w+/g);

    // returns a string of words separated by commas without the "-"
    return matches ? matches.map(word => word.substring(1)).join(",") : "";
}

export const getBlacklist = (args: string[]): string => {
    let blacklist = args.filter(arg => arg.startsWith('-'));
    
    if (blacklist.length === 0){
        return "";
    }
    
    return args.filter(arg => arg.startsWith('-')).map(arg => arg.substring(1)).join(",");
}

export const getCategories = (args: string[]): string => {
    let categories = args.filter(arg => !arg.startsWith('-') && !arg.startsWith('"'));
    
    if (categories.length === 0){
        return "Any";
    }
    
    return args.filter(arg => !arg.startsWith('-') && !arg.startsWith('"')).join(",");
}

export const getSearchWord2 = (args: string[]): string => {
    let words: string[] = args.filter(arg => arg.startsWith('"') && arg.endsWith('"')).map(arg => arg.slice(1, -1))
    if (words.length > 1){
        throw new Error('Only one search word is allowed');
    }
    else if (words.length === 0){
        return "";
    }
    return words[0];
}

function getSearchWord(input: string): string {
    // regex to match words or phrases in quotes
    const matches = input.match(/\w+|"[^"]+"/g);
    const quotedMatches = matches != null ? matches.filter(match => match.startsWith('"') && match.endsWith('"')) : [];
    
    if (!quotedMatches || quotedMatches.length === 0) {
      return "";
    }
   
    else if (quotedMatches.length > 1){
        throw new Error('Only one search word is allowed');
    }

    // removes the quotes and replaces spaces with %20
    return quotedMatches[0].replace(/"/g, '')
                           .replace(/ /g, '%20');
  }

export const buildJokeUrl = (args: string): string => {
    if (args === ""){
        return "https://v2.jokeapi.dev/joke/Any";
    }
    let categories = getCategories(args.split(' '));
    let blacklist = getBlacklist(args.split(' '));
    console.log("blacklist " + blacklist);
    let searchWord = getSearchWord(args);
    console.log("searchWord " + searchWord);
    let url = `https://v2.jokeapi.dev/joke/${categories}`;
    if (blacklist != "" || searchWord != "") {url += "?";}
    if (blacklist != "") {url += "blacklistFlags=" + blacklist;}
    if (blacklist != "" && searchWord != "") {url += "&";}
    if (searchWord != "") {url += `contains=${searchWord}`;}
    console.log("url " + url);
    return url;

}