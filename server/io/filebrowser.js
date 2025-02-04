const { promises: fsp } = require('fs');
const path = require('path');
module.exports = (io, socket) => {
    socket.on('server:filebrowser:list', async (params) => {
        console.log('socket.io : server:filebrowser:list', params);
        let show_hidden = false;
        if (params.hasOwnProperty('show_hidden') && params.show_hidden === true) {
            show_hidden = true;
        }

        // In a real application, you would fetch data from a database or other source
        let base_path = '/home/destin';
        let files = await fsp.readdir(base_path, { withFileTypes: true });
        let file_results = [];
        let dir_results = [];
        for (let file of files) {
            let fullPath = path.join(base_path, file.name);
            if (file.name == '.' || file.name == '..') continue; // ignore the directory pointers

            if (!show_hidden && file.name.startsWith('.')) continue; // don't show hidden

            let res = file;

            res.is_directory = false;
            res.is_symlink = false;
            res.fs_path = fullPath;
            res.link_path = fullPath;

            if (file.isSymbolicLink()) {
                let sl_path = await fsp.readlink(fullPath);
                let link_stat = await fsp.stat(sl_path);
                res.is_symlink = true;
                res.link_path = sl_path;
                if (link_stat.isDirectory()) {
                    res.is_directory = true;
                    dir_results.push(res);
                }
            } else {
                if (file.isDirectory()) {
                    res.is_directory = true;
                    dir_results.push(res);
                } else {
                    file_results.push(res);
                }
            }
        }
        dir_results.sort((a, b) => a.name.localeCompare(b.name));
        file_results.sort((a, b) => a.name.localeCompare(b.name));
        const full_results = dir_results.concat(file_results);
        socket.emit('client:filebrowser:list', { files: full_results, path: base_path });
    });
};