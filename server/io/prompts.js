const fsp = require('fs').promises;
const os = require('os');
const path = require('path');
const showdown = require('showdown');
module.exports = (io, socket, db) => {
    socket.on('server:prompts:get:single_by_id', async (params) => {
        console.log('socket.io : server:prompts:get:single_by_id', params);

        socket.emit('client:prompts:got:single', { status });
    });
    socket.on('server:prompts:get:multiple', async (params) => {
        console.log('socket.io : server:prompts:get:single_by_id', params);

        socket.emit('client:prompts:got:single', { status });
    });
    socket.on('server:prompts:save', async (params) => {
        console.log('socket.io : server:prompts:save', params);

        if ('new' === params.method) {

        }

        socket.emit('server:prompts:save_complete', {});
    });
    socket.on('server:prompts:clone', async (params) => {
        console.log('socket.io : client:prompts:clone', params);

        socket.emit('server:prompts:get:single_most_recent', {
            status
        });
    });
};
