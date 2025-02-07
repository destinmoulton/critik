const filebrowserHandler = require('./filebrowser');
const fileviewerHandler = require('./fileviewer');
const promptsHandler = require('./prompts');

module.exports = (io, socket, db) => {
    console.log('socket.io :: user connected');

    socket.on('disconnect', () => {
        console.log('socket.io :: user disconnected');
    });

    filebrowserHandler(io, socket, db);
    fileviewerHandler(io, socket, db);
    promptsHandler(io, socket, db);
};