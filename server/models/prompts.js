const Model = require('./model.js');

class PromptsModel extends Model {
    constructor(db) {
        super();
        this._db = db;
        this._table_name = 'prompts';
        this._primary_key = 'id';

        this._create_query = `CREATE TABLE ${this._table_name}
                              (
                                  id      INTEGER PRIMARY KEY AUTOINCREMENT,
                                  type    TEXT NOT NULL,
                                  prompt  TEXT NOT NULL,
                                  created DATETIME DEFAULT CURRENT_TIMESTAMP
                              )`;

        try {
            this._initializeTable();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PromptsModel;