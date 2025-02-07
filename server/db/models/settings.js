const Model = require('./model.js');

class SettingsModel extends Model {
    constructor(db) {
        super();
        this._db = db;
        this._table_name = 'settings';
        this._primary_key = 'id';

        this._create_query = `CREATE TABLE ${this._table_name}
                              (
                                  id      INTEGER PRIMARY KEY AUTOINCREMENT,
                                  key     TEXT NOT NULL,
                                  setting TEXT NOT NULL
                              )`;


    }

    async init() {
        try {
            await this._initializeTable();
        } catch (error) {
            throw error;
        }
    }


}

module.exports = SettingsModel;