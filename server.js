const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Set the view engine as EJS and specify the 'views' directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { page: 'Home', data: 'Some dynamic data', pageTitle: 'Producer Dashboard'});
});

app.get('/playlist-builder', (req, res) => {
    res.render('playlist-builder', { page: 'Playlist Builder', data: 'Different dynamic data', pageTitle: 'Playlist Builder'});
});

app.get('/event-promotions', (req, res) => {
    res.render('event-promotions', { page: 'Event Promotions', data: 'More dynamic data', pageTitle: 'Event Promotions'});
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
