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
    socket.on('server:prompts:get:all_prompts', async (params) => {
        console.log('socket.io : server:prompts:get:all_prompts', params);

        let prompts = await db.models.prompts.getAllRows(params.order_by, params.order);
        if (null === prompts || undefined === prompts) {
            prompts = [];
        } else if (!Array.isArray(prompts)) {
            prompts = [prompts];
        }
        socket.emit('client:prompts:got:all_prompts', { status: 'success', prompts });
    });
    socket.on('server:prompts:get:single_most_recent', async () => {
        console.log('socket.io : server:prompts:get:single_most_recent');
        let recent = await db.models.prompts.getSingleMostRecent();
        if (undefined === recent) {
            // Set blank one
            recent = {
                id: 0,
                prompt_type: 'user',
                prompt_text: ''
            };
        }
        socket.emit('client:prompts:got:single', { status: 'success', prompt: recent });
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
    socket.on('server:prompts:delete:single_by_id', async (params) => {

        const res = await db.models.prompts.deleteRowById(params.prompt_id);
        const prompt_id = res;
        socket.emit('client:prompts:delete_complete', { prompt_id });
    });
};
