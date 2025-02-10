const fsp = require('fs').promises;
const os = require('os');
const path = require('path');
const showdown = require('showdown');

/**
 *
 * @param io
 * @param socket
 * @param db sqlite
 */
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

        let prompt_id = params.prompt.id;
        let new_prompt = {};
        let status = 'success';
        let error = '';
        let res = {};
        const data = {
            prompt_type: params.prompt.type,
            prompt_text: params.prompt.text
        };
        if ('new' === params.method) {
            res = await db.models.prompts.insertRow(data);
            prompt_id = res.last_id;
            console.log('io/promps.js :: new is running', res);
        } else {
            res = await db.models.prompts.updateRowById(params.prompt.id, data);
            prompt_id = params.prompt.id;
        }

        if (res.err) {
            status = 'error';
            error = res.err;
        } else {
            new_prompt = await db.models.prompts.getSingleById(prompt_id);
        }
        console.log('io/prompts.js new_prompt', new_prompt);

        socket.emit('client:prompts:save_complete', { status, prompt: new_prompt, error });
    });
    socket.on('server:prompts:clone', async (params) => {
        console.log('socket.io : client:prompts:clone', params);

        socket.emit('server:prompts:get:single_most_recent', {
            status
        });
    });
};
