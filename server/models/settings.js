const Model = require('./model.js');

class Settings extends Model {
    constructor(db) {
        super();
        this._db = db;
        this._table_name = 'settings';

        this._create_query = `CREATE TABLE ${this._table_name}
                              (
                                  id      INTEGER PRIMARY KEY AUTOINCREMENT,
                                  key     TEXT NOT NULL,
                                  setting TEXT NOT NULL
                              )`;


        try {
            this._initializeTable();
        } catch (error) {
            throw error;
        }
    }


    static getAll() {
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                return callback(err);
            }
            const users = rows.map(row => new User(row.id, row.username, row.email));
            callback(null, users);
        });
    }

}

module.exports = Settings;