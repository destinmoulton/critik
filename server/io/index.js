const filebrowserHandler = require('./filebrowser');

module.exports = (io, socket) => {
    console.log('socket.io :: user connected');

    socket.on('disconnect', () => {
        console.log('socket.io :: user disconnected');
    });

    filebrowserHandler(io, socket);
};