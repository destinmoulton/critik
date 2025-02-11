const { default: ollama } = require('ollama');
const showdown = require('showdown');
/**
 *
 * @param io
 * @param socket
 * @param db sqlite
 */
module.exports = (io, socket, db) => {
    socket.on('server:llm:get:chat', async (params) => {
        console.log('socket.io : server:llm:get:chat', params);

        console.log(await ollama.list());
        const resp = await ollama.chat({
            model: params.model,
            keep_alive: '30m',
            messages: [{
                role: params.role,
                content: params.content
            }]
        });

        let converter = new showdown.Converter();
        const chat_html = converter.makeHtml(resp.message.content);
        socket.emit('client:llm:got:response', { status: 'success', full_response: resp, chat_html: chat_html });
    });
    socket.on('server:llm:get:list_models', async (params) => {

        const models = await ollama.list();
        socket.emit('client:llm:got:models', models);
    });
};
