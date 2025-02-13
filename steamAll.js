const fetch = require("node-fetch");
const fs = require("fs");

const steamSpyUrl = "https://steamspy.com/api.php?request=all&page=4";

async function fetchAllGames() {
    try {
        const response = await fetch(steamSpyUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const games = Object.values(data).map((game) => ({
            name: game.name,
            appid: game.appid,
            owners: game.owners,
            posterUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`,
        }));

        console.log(games);

        fs.writeFileSync("all_games_page_4.json", JSON.stringify(games, null, 2));
        console.log("Data saved to all_games_page_0.json");
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

fetchAllGames();
