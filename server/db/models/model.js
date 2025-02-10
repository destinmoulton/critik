class Model {
    _table_name;
    _db;
    _create_query;
    _primary_key;

    /**
     * This will setup the model after construction.
     *
     * Need this to be separate as constructor cannot be async.
     *
     * @returns {Promise<void>}
     */
    async init() {
        try {
            await this._initializeTable();
            await this._extraInitialization();
        } catch (error) {
            throw error;
        }
    }

    /**
     * A child method that will be called in case children need it.
     * @returns {Promise<void>}
     * @private
     */
    async _extraInitialization() {
    }

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
    }

    async getAllRows(orderBy, orderDirection) {
        return await this._db.get(`SELECT *
                                   FROM ${this._table_name}
                                   ORDER BY ${orderBy} ${orderDirection}`);
    }

    async getSingleById(id) {
        if (!this.hasPrimaryKey()) {
            throw new Error(`ERROR::model.js::getSingleById() : No primary key set for model. Table: '${this._table_name}'`);
        }

        return await this._db.get(`SELECT *
                                   FROM ${this._table_name}
                                   WHERE ${this._primary_key} = ?`, id);
    }

    async getRowById(id) {
        if (!this.hasPrimaryKey()) {
            throw new Error(`ERROR::model.js::getRowById() : No primary key set for model. Table: '${this._table_name}'`);
        }

        return await this._db.get(`SELECT *
                                   FROM ${this._table_name}
                                   WHERE ${this._primary_key} = ?`, id);
    }

    async insertRow(row) {
        if (Object.keys(row).length == 0) {
            const err = `ERROR::model.js::insertRow() : No row properties are set for insertion`;
            return { last_id: 0, err };
        }

        let insmap = {};
        let columns = [];
        let colids = [];
        for (const columnName in row) {
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
        const res = await this._db.run(query, insmap);
        if (Object.hasOwn(res, 'last_id') && 0 === res.last_id) {
            return { last_id: 0, err: 'Failed to insert row.' };
        }
        return { last_id: res.lastID, err: false };
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
        for (const key in data) {
            const dt = data[key];

            const colid = ':' + key;
            upmap[colid] = dt;
            upparts.push(`${key} = ${colid}`);
        }

        // Build the update string
        const upstring = upparts.join(', ');

        const query = `UPDATE ${this._table_name}
                       SET ${upstring}
                       WHERE ${this._primary_key} = ${pkeyid}`;

        const res = await this._db.run(query, upmap);
        if (0 === res.changes) {
            const err = `ERROR::model.js::updateRowById() : Failed to update row`;
            return { changes: 0, err };
        }
        return { changes: res.changes, err: false };
    }

    hasPrimaryKey() {
        return this._primary_key !== undefined && this._primary_key !== null;
    }


}

module.exports = Model;