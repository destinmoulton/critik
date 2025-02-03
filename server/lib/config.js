/**
 * Configuration is stored as a json file in the user's config dir
 * as defined by xdg
 */

const path = require('path');
const fsp = require('fs').promises;

const xdg = require('@folder/xdg');
const config_filename = 'critik.json';
const config_dir_name = 'critik';


async function open_config() {
    const dirs = xdg();

    const path = path.join(dirs.config, config_dir_name);
    try {
        await fsp.access(path);
    } catch (error) {
        console.log(path);
        console.error(error);
    }

}

module.exports = {};