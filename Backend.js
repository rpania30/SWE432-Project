const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

// Use express.json() to parse JSON bodies into JS objects
app.use(express.json());

// Connection URL with the database name
const url = 'mongodb://localhost:27017/musicStationDB';

// Connect to MongoDB with Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB at ${url}`))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define a schema for your tracks
const trackSchema = new mongoose.Schema({
  title: String
});

// Create a model from the schema
const Track = mongoose.model('Track', trackSchema);

// Endpoint to add a track
app.post('/addTrack', async (req, res) => {
    // Create a new track using the Mongoose model, which now includes validation and type casting
    const newTrack = new Track({ title: req.body.title }); // Assuming the title is sent in the request body
    try {
        // Save the new track to the database
        await newTrack.save();
        res.status(200).send('Track added');
    } catch (err) {
        // If an error occurs, send back a 500 error
        res.status(500).send('Error adding track: ' + err.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
