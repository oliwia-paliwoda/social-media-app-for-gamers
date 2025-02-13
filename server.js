

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
const uri = "mongodb+srv://oliwiapaliwoda1:N8rheFi9D6SCpWxS@cluster0.9lvs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

app.get('/api/get-email/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const db = client.db('my_app');
        const user = await db.collection('credentials').findOne({ username });

        if (!user || !user.email) {
            return res.status(404).json({ error: 'User not found or email not set' });
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        console.error('Error fetching email:', error);
        res.status(500).json({ error: 'Failed to fetch email' });
    }
});

app.post('/api/delete-user', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const db = client.db('my_app');

        const credentialsResult = await db.collection('credentials').deleteOne({ username });

        const bioResult = await db.collection('biographies').deleteOne({ username });

        const notificationsReceiverResult = await db.collection('notifications').deleteMany({ receiver: username });

        const notificationsSenderResult = await db.collection('notifications').deleteMany({ senderUsername: username });

        const usersResult = await db.collection('users').deleteOne({ _id: username });

        const postsResult = await db.collection('posts').deleteMany({ userId: username });

        const commentsCursor = await db.collection('comments').find({ username });
        let commentsDeleted = 0;

        while (await commentsCursor.hasNext()) {
            const comment = await commentsCursor.next();
            await db.collection('posts').updateOne(
                { postId: comment.postId },
                { $inc: { commentCount: -1 } }
            );
            await db.collection('comments').deleteOne({ _id: comment._id });
            commentsDeleted++;
        }

        const likedByResult = await db.collection('posts').updateMany(
            { likedBy: username },
            { $pull: { likedBy: username }, $inc: { starCount: -1 } }
        );

        const friendsResult = await db.collection('users').updateMany(
            { friends: { $elemMatch: { username } } },
            { $pull: { friends: { username } } }
        );

        const profileImagePath = path.join(__dirname, 'dist', 'images', 'pfps', `${username}.png`);
        if (fs.existsSync(profileImagePath)) {
            fs.unlinkSync(profileImagePath);
            console.log(`Profile image for ${username} deleted successfully.`);
        }

        res.status(200).json({
            message: 'User and related data deleted successfully',
            deleted: {
                credentials: credentialsResult.deletedCount,
                users: usersResult.deletedCount,
                posts: postsResult.deletedCount,
                commentsDeleted: commentsDeleted,
                likedByUpdates: likedByResult.modifiedCount,
                friendsUpdated: friendsResult.modifiedCount,
                bioDeleted: bioResult.deletedCount,
                notificationReceivedDeleted: notificationsReceiverResult.deletedCount,
                notificationSentDeleted: notificationsSenderResult.deletedCount,
                profileImageDeleted: fs.existsSync(profileImagePath) ? false : true
            }
        });
    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({ error: 'Failed to delete user and related data' });
    }
});

app.get('/api/notifications/friend-request', async (req, res) => {
    const { myUsername, username } = req.query;

    try {
        const db = client.db('my_app');
        const notification = await db.collection('notifications').findOne({
            type: 'friendRequest',
            action: '',
            $or: [
                { senderUsername: myUsername, receiver: username },
                { senderUsername: username, receiver: myUsername }
            ]
        });

        if (!notification) {
            return res.status(200).json(null);
        }

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error fetching friend request notification:', error);
        res.status(500).json({ error: 'Failed to fetch friend request status' });
    }
});




app.post('/api/verify-password', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('my_app');
        const user = await db.collection('credentials').findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Password verified successfully' });
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ error: 'Failed to verify password' });
    }
});

app.get('/api/matching-users', async (req, res) => {
    try {
        const db = client.db('my_app');        const usersCollection = db.collection('users');        const gamesCollection = db.collection('games');        const myUsername = req.query.myUsername || '';        const currentUser = await usersCollection.findOne({ _id: myUsername });
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { country, connections, platforms, games, friends } = currentUser;        const friendIds = friends.map(friend => friend.username);        const query = {
            $and: [
                { _id: { $ne: myUsername } },
                { _id: { $nin: friendIds } },
                {
                    $or: [
                        { country: { $in: country } },
                        { 'connections.connection': { $in: connections.map(conn => conn.connection) } },
                        { platforms: { $in: platforms } },
                        { games: { $in: games } },
                    ]
                }
            ]
        };        const matchingUsers = await usersCollection.find(query).toArray();        const gameDetails = await gamesCollection.find({ name: { $in: games } }).toArray();
        const gameDetailsMap = gameDetails.reduce((map, game) => {
            map[game.name] = game.path;
            return map;
        }, {});        const result = matchingUsers.map(user => {
            const matchingCountries = user.country.filter(c => country.includes(c));
            const matchingConnections = user.connections.filter(conn => connections.map(c => c.connection).includes(conn.connection));
            const matchingPlatforms = user.platforms.filter(p => platforms.includes(p));
            const matchingGames = user.games
                .filter(g => games.includes(g))
                .map(g => ({ name: g, path: gameDetailsMap[g] || null }));

            return {
                username: user._id,
                displayedName: user.username,
                matchingCountries,
                matchingConnections,
                matchingPlatforms,
                matchingGames,
                totalMatches: matchingCountries.length + matchingConnections.length + matchingPlatforms.length + matchingGames.length,
            };
        });        result.sort((a, b) => b.totalMatches - a.totalMatches);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching matching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


app.get('/api/search-users', async (req, res) => {
    try {
        const db = client.db('my_app');        const collection = db.collection('users');        const myUsername = req.query.myUsername || '';        const searchedUsername = req.query.searchedUsername || '';
        const selectedCountries = req.query.selectedCountries ? JSON.parse(req.query.selectedCountries) : [];
        const selectedConnections = req.query.selectedConnections ? JSON.parse(req.query.selectedConnections) : [];
        const selectedPlatforms = req.query.selectedPlatforms ? JSON.parse(req.query.selectedPlatforms) : [];
        const selectedGames = req.query.selectedGames ? JSON.parse(req.query.selectedGames) : [];
        const selectedOption = req.query.selectedOption || 'at-least-one';

        const query = {};        if (searchedUsername) {
            query.$or = [
                { _id: { $regex: searchedUsername, $options: 'i' } },
                { username: { $regex: searchedUsername, $options: 'i' } },
            ];
        }        if (selectedCountries.length > 0) {
            if (selectedOption === 'all') {
                query.country = { $all: selectedCountries };            } else {
                query.country = { $in: selectedCountries };            }
        }        if (selectedConnections.length > 0) {
            if (selectedOption === 'all') {
                query['connections.connection'] = { $all: selectedConnections };            } else {
                query['connections.connection'] = { $in: selectedConnections };            }
        }        if (selectedPlatforms.length > 0) {
            if (selectedOption === 'all') {
                query.platforms = { $all: selectedPlatforms };            } else {
                query.platforms = { $in: selectedPlatforms };            }
        }        if (selectedGames.length > 0) {
            if (selectedOption === 'all') {
                query.games = { $all: selectedGames };            } else {
                query.games = { $in: selectedGames };            }
        }        let finalQuery;
        if (selectedOption === 'all') {
            finalQuery = { $and: Object.entries(query).map(([key, value]) => ({ [key]: value })) };
        } else {
            const orConditions = Object.entries(query).map(([key, value]) => ({ [key]: value }));            if (orConditions.length === 0) {
                return res.status(200).json([]);
            }

            finalQuery = {
                $or: orConditions
            };
        }        finalQuery.$and = finalQuery.$and || [];
        finalQuery.$and.push({ _id: { $ne: myUsername } });        finalQuery.$and.push({
            'friends.username': { $ne: myUsername },
        });        const users = await collection.find(finalQuery).toArray();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});



app.delete('/api/friends/remove', async (req, res) => {
    try {
        const { myUsername, friendUsername } = req.body;

        if (!myUsername || !friendUsername) {
            return res.status(400).json({ error: 'Both usernames are required.' });
        }

        const database = client.db('my_app');
        const usersCollection = database.collection('users');        const myUpdateResult = await usersCollection.updateOne(
            { username: myUsername },
            { $pull: { friends: { username: friendUsername } } }
        );        const friendUpdateResult = await usersCollection.updateOne(
            { username: friendUsername },
            { $pull: { friends: { username: myUsername } } }
        );

        if (myUpdateResult.modifiedCount === 0 && friendUpdateResult.modifiedCount === 0) {
            return res.status(404).json({ error: 'Friends not found or already removed.' });
        }

        res.status(200).json({ message: 'Friend removed successfully.' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'Failed to remove friend.' });
    }
});


app.post('/api/notifications/update-action', async (req, res) => {
    try {
        const { notificationId, action, senderUsername, senderDisplayedName, receiver } = req.body;

        console.log("Received data:", { notificationId, action, senderUsername, senderDisplayedName, receiver });

        if (!notificationId || !action || !senderUsername || !senderDisplayedName || !receiver) {
            console.error("Missing required fields:", { notificationId, action, senderUsername, senderDisplayedName, receiver });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const database = client.db('my_app');
        const notificationsCollection = database.collection('notifications');
        const usersCollection = database.collection('users');
        const credentialsCollection = database.collection('credentials');        console.log("Updating notification action...");
        const result = await notificationsCollection.updateOne(
            { _id: new ObjectId(notificationId) },
            { $set: { action } }
        );

        if (result.modifiedCount === 0) {
            console.error("Notification not found or already updated:", notificationId);
            return res.status(404).json({ error: 'Notification not found or already updated' });
        }        if (action === 'accepted') {
            console.log("Action is accepted. Updating friends...");

            const friendObjectForReceiver = {
                username: senderUsername,
                displayedName: senderDisplayedName,
            };            console.log("Fetching displayedName for receiver:", receiver);
            const receiverCredentials = await credentialsCollection.findOne({ username: receiver });
            if (!receiverCredentials) {
                console.error("Receiver credentials not found:", receiver);
                return res.status(404).json({ error: 'Receiver credentials not found' });
            }

            const friendObjectForSender = {
                username: receiver,
                displayedName: receiverCredentials.displayedName,
            };            console.log("Adding sender to receiver's friends list:", receiver, friendObjectForReceiver);
            const receiverUpdateResult = await usersCollection.updateOne(
                { username: receiver },
                { $addToSet: { friends: friendObjectForReceiver } }            );

            if (receiverUpdateResult.modifiedCount === 0) {
                console.error("Failed to update receiver's friends list:", receiver);
                return res.status(404).json({ error: 'Receiver not found or friend already added' });
            }            console.log("Adding receiver to sender's friends list:", senderUsername, friendObjectForSender);
            const senderUpdateResult = await usersCollection.updateOne(
                { username: senderUsername },
                { $addToSet: { friends: friendObjectForSender } }            );

            if (senderUpdateResult.modifiedCount === 0) {
                console.error("Failed to update sender's friends list:", senderUsername);
                return res.status(404).json({ error: 'Sender not found or friend already added' });
            }

            console.log("Friends updated successfully.");
        }

        res.status(200).json({ message: 'Action updated and friends added successfully' });
    } catch (error) {
        console.error('Error updating action and friends:', error);
        res.status(500).json({ error: 'Failed to update action and friends' });
    }
});


app.post('/api/notifications/friend-request-accepted', async (req, res) => {
    try {
        const { receiver, senderDisplayedName, senderUsername } = req.body;

        if (!receiver || !senderDisplayedName || !senderUsername) {
            return res.status(400).json({ error: 'Receiver, senderDisplayedName, and senderUsername are required' });
        }

        const database = client.db('my_app');
        const notificationsCollection = database.collection('notifications');        const newNotification = {
            receiver,
            senderDisplayedName,
            senderUsername,
            type: 'friendRequestAccepted',
            seen: false,
            action: "",
            date: new Date().toISOString(),        };        const result = await notificationsCollection.insertOne(newNotification);

        res.status(201).json({ message: 'Friend request sent successfully', notificationId: result.insertedId });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});


app.post('/api/notifications/send-friend-request', async (req, res) => {
    try {
        const { receiver, senderDisplayedName, senderUsername } = req.body;

        if (!receiver || !senderDisplayedName || !senderUsername) {
            return res.status(400).json({ error: 'Receiver, senderDisplayedName, and senderUsername are required' });
        }

        const database = client.db('my_app');
        const notificationsCollection = database.collection('notifications');        const newNotification = {
            receiver,
            senderDisplayedName,
            senderUsername,
            type: 'friendRequest',
            seen: false,
            action: "",
            date: new Date().toISOString(),        };        const result = await notificationsCollection.insertOne(newNotification);

        res.status(201).json({ message: 'Friend request sent successfully', notificationId: result.insertedId });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});


app.post('/api/save-image', (req, res) => {
    const { username, image, type } = req.body;

    if (!username || !image || !type) {
        return res.status(400).json({ error: "Username, image, and type are required" });
    }    const base64Data = image.replace(/^data:image\/png;base64,/, "");    const directoryPath = type === 'profile'
        ? path.join(__dirname, 'dist', 'images', 'pfps')        : path.join(__dirname, 'dist', 'images', 'backgrounds');
    console.log("Saving to directory:", directoryPath);    if (!fs.existsSync(directoryPath)) {
        console.log("Directory does not exist. Creating:", directoryPath);
        fs.mkdirSync(directoryPath, { recursive: true });
    }    const filePath = path.join(directoryPath, `${username}.png`);
    console.log("Saving file to:", filePath);    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error("Error saving file:", err);
            return res.status(500).json({ error: "Failed to save image" });
        }

        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} picture saved for ${username} at ${filePath}`);
        res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} picture saved successfully` });
    });
});


app.get('/api/user-details/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const database = client.db('my_app');
        const usersCollection = database.collection('users');
        const gamesCollection = database.collection('games');        const user = await usersCollection.findOne(
            { _id: userId },
            { projection: { country: 1, connections: 1, platforms: 1, games: 1 } }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }        const userGames = await gamesCollection.find({ name: { $in: user.games || [] } }).toArray();        const gamesWithDetails = userGames.map(game => ({
            name: game.name,
            path: game.path
        }));        const userDetails = {
            country: user.country || [],
            connections: user.connections || [],
            platforms: user.platforms || [],
            games: gamesWithDetails
        };

        res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});


app.get('/api/posts/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const database = client.db('my_app');
        const postsCollection = database.collection('posts');        const userPosts = await postsCollection
            .find({ userId })            .sort({ createdAt: -1 })            .toArray();

        if (!userPosts.length) {
            return res.status(404).json({ error: 'No posts found for the given userId' });
        }

        res.status(200).json(userPosts);
    } catch (error) {
        console.error('Error fetching posts for user:', error);
        res.status(500).json({ error: 'Failed to fetch posts for the user' });
    }
});

app.get('/api/notifications/unseen/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');        const notificationsCollection = database.collection('notifications');        const unseenNotificationExists = await notificationsCollection.findOne({
            receiver: username,
            seen: false
        });        res.status(200).json({ hasUnseen: !!unseenNotificationExists });
    } catch (error) {
        console.error('Error checking unseen notifications:', error);
        res.status(500).json({ error: 'Failed to check unseen notifications' });
    }
});

app.post('/api/notifications/mark-seen', async (req, res) => {
    try {
        const { notificationIds } = req.body;        console.log('Received notification IDs:', notificationIds);
        if (!notificationIds || notificationIds.length === 0) {
            return res.status(400).json({ error: 'No notification IDs provided' });
        }

        const database = client.db('my_app');        const notificationsCollection = database.collection('notifications');        const result = await notificationsCollection.updateMany(
            { _id: { $in: notificationIds.map(id => new ObjectId(id)) } },            { $set: { seen: true } }        );

        console.log('Updated notifications:', result.modifiedCount);        res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating notifications:', error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
});


app.get('/api/notifications/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');        const notificationsCollection = database.collection('notifications');        const notifications = await notificationsCollection.find({ receiver: username }).toArray();

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ error: 'No notifications found' });
        }        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});


app.get('/api/background/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');
        const users = database.collection('users');        const user = await users.findOne({ _id: username });

        if (user && user.background) {
            return res.status(200).json({ background: user.background });
        } else {
            return res.status(404).json({ error: 'Background not found' });
        }
    } catch (error) {
        console.error('Error fetching background:', error);
        res.status(500).json({ error: 'Failed to fetch background' });
    }
});




app.get('/api/biography/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');        const biographiesCollection = database.collection('biographies');        const biography = await biographiesCollection.findOne({ username });

        if (!biography) {
            return res.status(404).json({ error: 'Biography not found' });
        }        res.status(200).json({ username: biography.username, bio: biography.bio });
    } catch (error) {
        console.error('Error fetching biography:', error);
        res.status(500).json({ error: 'Failed to fetch biography' });
    }
});




app.post('/api/update-user-details', async (req, res) => {
    try {
        const { username, country, platforms, connections, games } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const database = client.db('my_app');
        const users = database.collection('users');        const user = await users.findOne({ _id: username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }        await users.updateOne(
            { _id: username },            {
                $set: {
                    country: country || [],                    platforms: platforms || [],                    connections: connections || [],                    games: games || []                }
            }
        );        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Failed to update user details' });
    }
});



app.get('/api/friends/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');
        const users = database.collection('users');        const user = await users.findOne({ _id: username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});

app.post('/api/update-biography', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).json({ error: 'Username and bio are required' });
    }

    try {
        const db = client.db('my_app');        const collection = db.collection('biographies');        const result = await collection.updateOne(
            { username: username },            { $set: { bio: bio } },            { upsert: true }        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
            res.status(200).json({ message: 'Biography updated successfully' });
        } else {
            res.status(200).json({ message: 'No changes made to the biography' });
        }
    } catch (error) {
        console.error('Error updating biography:', error);
        res.status(500).json({ error: 'Failed to update biography' });
    }
});

app.post('/api/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Username, old password, and new password are required' });
    }

    try {
        const db = client.db('my_app');        const collection = db.collection('credentials');        const user = await collection.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }        const hashedPassword = await bcrypt.hash(newPassword, 10);        const result = await collection.updateOne(
            { username },            { $set: { password: hashedPassword } }        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(200).json({ message: 'No changes made to the password' });
        }

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

app.post('/api/update-background', async (req, res) => {
    const { username, background } = req.body;

    if (!username || !background) {
        return res.status(400).json({ error: 'Username and background are required' });
    }

    try {
        const db = client.db('my_app');        const collection = db.collection('users');        const result = await collection.updateOne(
            { username: username },            { $set: { background: background } },            { upsert: true }        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
            res.status(200).json({ message: 'Background updated successfully' });
        } else {
            res.status(200).json({ message: 'No changes made to the background' });
        }
    } catch (error) {
        console.error('Error updating background:', error);
        res.status(500).json({ error: 'Failed to update background' });
    }
});

app.post('/api/update-displayed-name', async (req, res) => {
    const { username, displayedName } = req.body;

    if (!username || !displayedName) {
        return res.status(400).json({ error: 'Username and displayedName are required' });
    }

    try {
        const db = client.db('my_app');        const collection = db.collection('credentials');        const result = await collection.updateOne(
            { username: username },            { $set: { displayedName: displayedName } },            { upsert: false }        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Displayed name updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating displayed name:', error);
        res.status(500).json({ error: 'Failed to update displayed name' });
    }
});



app.post('/api/posts/unlike/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { username } = req.body;
        const database = client.db('my_app');
        const postsCollection = database.collection('posts');        const result = await postsCollection.updateOne(
            { postId: parseInt(postId) },
            {
                $pull: { likedBy: username },                $inc: { starCount: -1 }            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ error: 'Failed to unlike post' });
    }
});


app.post('/api/posts/like/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { username } = req.body;
        const database = client.db('my_app');
        const postsCollection = database.collection('posts');        const result = await postsCollection.updateOne(
            { postId: parseInt(postId) },            {
                $addToSet: { likedBy: username },                $inc: { starCount: 1 }            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Like added successfully' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});


app.get('/api/posts/friends/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');
        const usersCollection = database.collection('users');
        const postsCollection = database.collection('posts');        const user = await usersCollection.findOne({ _id: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }        const friendsUsernames = user.friends ? user.friends.map(friend => friend.username) : [];        const usernamesToFetch = [...friendsUsernames, username];        const posts = await postsCollection.find({ userId: { $in: usernamesToFetch } }).toArray();

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts from friends:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/api/comments/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const database = client.db("my_app");

        const commentsCollection = database.collection("comments");
        const credentialsCollection = database.collection("credentials");        const comments = await commentsCollection.find({ postId: Number(postId) }).toArray();        const commentsWithDisplayName = await Promise.all(
            comments.map(async (comment) => {
                const user = await credentialsCollection.findOne({ username: comment.username });
                return {
                    ...comment,
                    displayedName: (user && user.displayedName) ? user.displayedName : 'Unknown'                };
            })
        );

        res.status(200).json(commentsWithDisplayName);
    } catch (error) {
        console.error('Error fetching comments with displayed names:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});


app.post('/api/comments', async (req, res) => {
    try {
        const { postId, username, content, commentId } = req.body;

        if (!postId || !username || !content) {
            return res.status(400).json({ error: 'postId, username, and content are required' });
        }

        const database = client.db("my_app");
        const commentsCollection = database.collection("comments");
        const postsCollection = database.collection("posts");        const newComment = {
            commentId,
            postId: Number(postId),            username,
            content,
            createdAt: new Date().toISOString()        };        await commentsCollection.insertOne(newComment);        const updateResult = await postsCollection.updateOne(
            { postId: Number(postId) },            { $inc: { commentCount: 1 } }        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(201).json({ message: 'Comment added and commentCount updated', newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

app.delete('/api/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const database = client.db('my_app');
        const postsCollection = database.collection('posts');
        const commentsCollection = database.collection('comments');        const post = await postsCollection.findOne({ postId: parseInt(postId) });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }        await postsCollection.deleteOne({ postId: parseInt(postId) });        const deleteResult = await commentsCollection.deleteMany({ postId: parseInt(postId) });

        res.status(200).json({
            message: 'Post and related comments deleted successfully',
            deletedCommentsCount: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Error deleting post and comments:', error);
        res.status(500).json({ error: 'Failed to delete post and related comments' });
    }
});


app.delete('/api/comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        const database = client.db('my_app');
        const commentsCollection = database.collection('comments');
        const postsCollection = database.collection('posts');        const comment = await commentsCollection.findOne({ commentId: parseInt(commentId) });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const { postId } = comment;        await commentsCollection.deleteOne({ commentId: parseInt(commentId) });        const updateResult = await postsCollection.updateOne(
            { postId: parseInt(postId) },
            { $inc: { commentCount: -1 } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ error: 'Post not found for updating commentCount' });
        }

        res.status(200).json({ message: 'Comment deleted and commentCount updated' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment and update commentCount' });
    }
});




app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email and password are required' });
        }

        const database = client.db('my_app');
        const credentials = database.collection('credentials');
        const users = database.collection('users');        const existingUser = await credentials.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const existingEmail = await credentials.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'E-mail address already in use' });
        }        const hashedPassword = await bcrypt.hash(password, 10);        const newCredential = {
            username,
            email,
            password: hashedPassword,
            displayedName: username,        };

        await credentials.insertOne(newCredential);        const newUser = {
            _id: username,            username,            bio: "",
            pfp_path: "",
            background_path: "",
            country: [],
            connections: [],
            platforms: [],
            games: [],
            friends: [],
        };

        await users.insertOne(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'E-mail and password are required' });
        }

        const database = client.db('my_app');
        const credentials = database.collection('credentials');        const user = await credentials.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid e-mail or password' });
        }        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }        res.status(200).json({ message: 'Login successful', username: user.username, displayedName: user.displayedName });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});app.get('/api/movies', async (req, res) => {
    try {
        const database = client.db("sample_mflix");
        const collection = database.collection("movies");

        const movies = await collection.find({}).limit(10).toArray();
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.get('/api/games', async (req, res) => {
    try {
        const database = client.db('my_app');
        const gamesCollection = database.collection('games');

        const games = await gamesCollection.find({}).toArray();
        res.status(200).json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

app.get('/api/displayedname/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const database = client.db('my_app');
        const credentialsCollection = database.collection('credentials');        const user = await credentialsCollection.findOne(
            { username },            { projection: { displayedName: 1, _id: 0 } }        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ displayedName: user.displayedName });
    } catch (error) {
        console.error('Error fetching displayedName:', error);
        res.status(500).json({ error: 'Failed to fetch displayedName' });
    }
});app.post('/api/posts', async (req, res) => {
    try {
        const { content, userId, displayedName } = req.body;

        if (!content || !displayedName || !userId) {
            return res.status(400).json({ error: 'Content, displayedName, and userId are required' });
        }        const postId = await getNextSequenceValue('posts');

        const newPost = {
            postId,
            content,
            userId,
            displayedName,
            createdAt: new Date().toISOString(),
            starCount: 0,
            commentCount: 0,
            likedBy: []        };

        const database = client.db("my_app");
        const posts = database.collection("posts");

        const result = await posts.insertOne(newPost);
        res.status(201).json({ message: 'Post added successfully', postId, result });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ error: 'Failed to add post' });
    }
});async function getNextSequenceValue(sequenceName) {
    const database = client.db("my_app");
    const counters = database.collection("counters");

    const sequenceDocument = await counters.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { returnDocument: 'after', upsert: true }
    );

    return sequenceDocument.value.sequence_value;
}process.on('SIGINT', async () => {
    if (isConnected) {
        await client.close();
        console.log("MongoDB connection closed");
    }
    process.exit(0);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));