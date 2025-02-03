const express = require('express');
const path = require('path');
const { connectToDB } = require('./middleware/db');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the Vue.js build directory
const clientBuildPath = path.join(__dirname, '../client/dist'); // Adjust path if needed
app.use(express.static(clientBuildPath));

// Setup the middleware db (req.db)
app.use(connectToDB);

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Catch-all route to serve the Vue.js index.html (for SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});