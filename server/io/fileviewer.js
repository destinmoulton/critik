const fsp = require('fs').promises;
const os = require('os');
const path = require('path');
const showdown = require('showdown');
module.exports = (io, socket, db) => {
    socket.on('server:fileviewer:getfile', async (params) => {
        console.log('socket.io : server:fileviewer:getfile', params);
        const path_to_file = params.file_path;
        let error = '';
        let file_path = path_to_file;
        let file_original_contents = '';
        let file_html = '';
        let status = 'success';
        try {
            let converter = new showdown.Converter();
            const file_contents = await fsp.readFile(path_to_file, 'utf-8');
            file_original_contents = file_contents;
            file_html = converter.makeHtml(file_contents);
        } catch (err) {
            status = 'error';
            error = err.message;
        }

        socket.emit('client:fileviewer:gotfile', { status, error, file_html, file_path, file_original_contents });
    });
};