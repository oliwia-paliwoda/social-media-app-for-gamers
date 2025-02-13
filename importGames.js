const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());
const uri = "mongodb+srv://oliwiapaliwoda1:N8rheFi9D6SCpWxS@cluster0.9lvs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


let isConnected = false;

async function connectToDatabase() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
        console.log("Connected to MongoDB");
    }
}

connectToDatabase();


async function importGamesFromJSON() {
    try {
        await connectToDatabase();

        const database = client.db("my_app");
        const gamesCollection = database.collection("games");

        const jsonFilePath = "all_games_page_4.json";
        const rawData = fs.readFileSync(jsonFilePath, "utf-8");
        const games = JSON.parse(rawData);

        let updatedCount = 0;
        for (const game of games) {
            const formattedGame = {
                name: game.name,
                path: game.posterUrl,
            };

            const result = await gamesCollection.updateOne(
                { name: formattedGame.name },
                { $set: formattedGame },
                { upsert: true }
            );

            if (result.matchedCount > 0) {
                updatedCount++;
            }
        }

        console.log(`Zaktualizowano lub dodano ${games.length} gier. Zaktualizowano: ${updatedCount}`);

        return { success: true, totalProcessed: games.length, updatedCount };
    } catch (error) {
        console.error("Błąd podczas importowania danych:", error.message);
        return { success: false, error: error.message };
    }
}


app.get('/api/import-games', async (req, res) => {
    const result = await importGamesFromJSON();

    if (result.success) {
        res.status(200).json({ message: `Dodano ${result.insertedCount} gier do kolekcji '${collectionName}'` });
    } else {
        res.status(500).json({ error: `Błąd: ${result.error}` });
    }
});

process.on('SIGINT', async () => {
    if (isConnected) {
        await client.close();
        console.log("MongoDB connection closed");
    }
    process.exit(0);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));