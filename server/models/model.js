class Model {
    _table_name;
    _db;
    _create_query;
    _primary_key;

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
            throw new Error(`ERROR::model.js::createTable() :  Cannot create table '${this._table_name}'`);
        }
        return true;
    }

    async getAllRows(orderBy, orderDirection) {
        if (undefined == orderBy || undefined == orderDirection) {
            throw new Error(`ERROR::model.js::getAllRows() : Must include an orderBy and orderDirection parameter.`);
        }
        return this._db.get(`SELECT *
                             FROM ${this._table_name}
                             ORDER BY ${orderBy} ${orderDirection}`);
    }

    async getSingleById(id) {
        if (!this.hasPrimaryKey()) {
            throw new Error(`ERROR::model.js::getSingleById() : No primary key set for model. Table: '${this._table_name}'`);
        }

        return this._db.get(`SELECT *
                             FROM ${this._table_name}
                             WHERE ${this._primary_key} = ?`, id);
    }

    async getRowById(id) {
        if (!this.hasPrimaryKey()) {
            throw new Error(`ERROR::model.js::getRowById() : No primary key set for model. Table: '${this._table_name}'`);
        }

        return this._db.get(`SELECT *
                             FROM ${this._table_name}
                             WHERE ${this._primary_key} = ?`, id);
    }

    async insertRow(row) {
        if (undefined == Object.keys(row).length == 0) {
            throw new Error(`ERROR::model.js::insertRow() : No row properties are set for insertion`);
        }

        let insmap = {};
        let columns = [];
        let colids = [];
        for (const columnName of row) {
            const dt = row[columnName];
            const colkey = ':' + columnName;

            insmap[colkey] = dt;

            columns.push(columnName);
            colids.push(colkey);
        }
        let colstr = columns.join(',');
        let valstr = colids.join(',');

        const query = `INSERT INTO ${this._table_name}(${colstr})
                       VALUES (${valstr})`;
        const res = await db.run(query, insmap);
        return res.lastID;
    }

    async updateRowById(id, data) {
        if (!this.hasPrimaryKey()) {
            throw new Error(`ERROR::model.js::updateRowById() : No primary key set for model. Table: '${this._table_name}'`);
        }

        let upmap = {
            ':id': id
        };

        let upparts = [];

        // The primary key id
        const pkeyid = ':' + this._primary_key;
        upmap[pkeyid] = id;
        for (const key of data) {
            const dt = data[key];

            upmap[':' + key] = dt;
            upparts.push(`${key} = ?`);
        }

        // Build the update string
        const upstring = upparts.join(', ');

        try {
            const query = `UPDATE ${this._table_name}
                           SET ${upstring}
                           WHERE ${this._primary_key} = ${pkeyid}`;

            const res = await db.run(query, upmap);
        } catch (err) {
            throw new Error(`ERROR::model.js::updateRowById() : Failed to update row with id: ${id} ${err}`);
        }
    }

    hasPrimaryKey() {
        return this._primary_key !== undefined && this._primary_key !== null;
    }


}

module.exports = Model;