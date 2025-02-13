const fetch = require("node-fetch");
const fs = require("fs");

const steamSpyUrl = "https://steamspy.com/api.php?request=top100owned";

async function fetchTopGames() {
    try {
        const response = await fetch(steamSpyUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const topGames = Object.values(data).map((game) => ({
            name: game.name,
            appid: game.appid,
            posterUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`,
        }));

        console.log(topGames);

        fs.writeFileSync("top_100_steam_games.json", JSON.stringify(topGames, null, 2));
        console.log("Data saved to top_100_steam_games.json");
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

fetchTopGames();
