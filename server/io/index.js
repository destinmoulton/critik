const filebrowserHandler = require('./filebrowser');
const fileviewerHandler = require('./fileviewer');

module.exports = (io, socket) => {
    console.log('socket.io :: user connected');

    socket.on('disconnect', () => {
        console.log('socket.io :: user disconnected');
    });

    filebrowserHandler(io, socket);
    fileviewerHandler(io, socket);
};