const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public'));

// Set the view engine as EJS and specify the 'views' directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// MongoDB connection URL and Database Name
const url = 'mongodb://localhost:27017/musicStationDB';

// Connect to MongoDB with Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB at ${url}`))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define a schema for tracks
const trackSchema = new mongoose.Schema({
  name: String,
  artist: String,
  genre: String,
  year: Number
});

// Create a model from the schema
const Track = mongoose.model('Track', trackSchema);


const SongListSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    year: Number,
    featuredArtist: String
});

const SongList = mongoose.model('SongList', SongListSchema, 'songlist');


app.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login' });
});

app.post('/login', (req, res) => {
    res.redirect('/');
});

// Define routes
app.get('/', (req, res) => {
    res.render('index', { page: 'Home', pageTitle: 'Producer Dashboard' });
});

app.get('/playlist-builder', async (req, res) => {
    try {
        const songs = await Track.find({});
        const songlist = await SongList.find({});
        res.render('playlist-builder', { page: 'Producer Dashboard', songs: songs, songlist: songlist, pageTitle: 'Producer Dashboard' });
    } catch (err) {
        res.status(500).send('Error fetching songs');
    }
});


app.get('/event-promotions', (req, res) => {
    res.render('event-promotions', { page: 'Event Promotions', pageTitle: 'Event Promotions' });
});

// Endpoint to add a song
app.post('/addSong', async (req, res) => {
    const newSong = new Track(req.body);
    try {
        await newSong.save();
        res.redirect('/playlist-builder');
    } catch (err) {
        res.status(500).send('Error adding song');
    }
});

// Endpoint to delete a song
app.post('/deleteSong', async (req, res) => {
    try {
        await Track.findByIdAndDelete(req.body.id);
        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting song' });
    }
});

app.post('/clearPlaylist', async (req, res) => {
    try {
        // This will delete all documents in the 'Track' collection
        const result = await Track.deleteMany({});
        res.json({ message: 'Playlist cleared', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing playlist', error: err.message });
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
