const path = require('path');
const http = require('http');


const express = require('express');
const { Server } = require('socket.io');

const socketHandler = require('./io/index');
const { connectToDB } = require('./middleware/db');

require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, { allowEIO3: true });

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

io.on('connection', (socket) => {
    socketHandler(io, socket);
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
