const Model = require('./model.js');

class PromptsModel extends Model {
    constructor(db) {
        super();
        this._db = db;
        this._table_name = 'prompts';
        this._primary_key = 'id';

        this._create_query = `CREATE TABLE ${this._table_name}
                              (
                                  id          INTEGER PRIMARY KEY AUTOINCREMENT,
                                  prompt_type TEXT NOT NULL,
                                  prompt_text TEXT NOT NULL,
                                  created     DATETIME DEFAULT CURRENT_TIMESTAMP
                              )`;

    }

    async getSingleMostRecent() {
        const query = `SELECT *
                       FROM ${this._table_name}
                       ORDER BY created DESC LIMIT 1;`;

        return await this._db.get(query);
    }

}

module.exports = PromptsModel;