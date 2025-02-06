const sqlite3 = require('sqlite3').verbose(); // .verbose() for better error messages
const sqlite = require('sqlite');
const fs = require('fs');
const path = require('path');
const xdg = require('@folder/xdg');

const SettingsModel = require('../models/settings');
const PromptsModel = require('../models/prompts');

const config_dir_name = 'critik';
const sqlite_filename = 'critik.sqlite3';

async function _initConfigDirectory(dbpath) {
    try {
        // Check if the folder exists
        const stats = await fs.promises.stat(dbpath);

        if (!stats.isDirectory()) {
            throw new Error(`The path ${dbpath} is not a directory`);
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            try {
                // Create the folder
                await fs.promises.mkdir(dbpath, { recursive: true });
            } catch (mkdirError) {
                throw new Error(`Failed to create config folder ${dbpath}: ${mkdirError.message}`);
            }
        } else if (error.code !== 'EPERM' && error.code !== 'EEXIST') {
            throw new Error(`Failed to check folder existence: ${error.message}`);
        }
    }
}

async function connectToDB(req, res, next) {
    // Get the xdg configured directories
    const dirs = xdg();

    const dbpath = path.join(dirs.config, config_dir_name);

    const dbfilename = path.join(dbpath, sqlite_filename);
    try {
        _initConfigDirectory(dbpath);
        db = await sqlite.open({
            filename: dbfilename,
            driver: sqlite3.Database
        });


        db.models = {};
        db.models.settings = new SettingsModel(db);
        db.models.prompts = new PromptsModel(db);

        req.db = db;
        next();
    } catch (error) {
        console.error(error, 'database filename: ' + dbfilename);
        return res.status(500).send(error.message);
    }

}

module.exports = { connectToDB };

