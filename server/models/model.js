class Model {
    _table_name;
    _db;
    _columns;
    _create_query;

    async _initializeTable() {
        if (!await this._doesTableExist()) {
            return await this._createTable();
        }
    }

    async _doesTableExist() {
        const row = await this._db.get(`SELECT name
                                        FROM sqlite_master
                                        WHERE type = 'table'
                                          AND name = ?`, [this._table_name]);
        return row !== undefined && row.name === this._table_name;
    }

    async _createTable() {
        const result = await this._db.exec(this._create_query, [this._table_name]);
        if (!await this._doesTableExist()) {
            throw new Error(`ERROR: Cannot create table '${this._table_name}'`);
        }
        return true;
    }
}

module.exports = Model;