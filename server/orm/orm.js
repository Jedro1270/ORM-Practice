class ORM {

    constructor(database) {
        this.database = database
    }

    async retrieve(table, columns, whereClause, whereOperators) {
        let output;
        let sql = 'SELECT '

        for (let index = 0; index < columns.length; index++) {
            if (index > 0) {
                sql += ',';
            }

            sql += `${columns[index]}`;
        }

        sql += ` FROM ${table}`;

        if (whereClause != null) {
            sql += ` WHERE `;

            if (whereOperators != null && whereClause.length - 1 !== whereOperators.length) {
                throw 'Invalid whereOperators length';
            }

            const columns = Object.keys(whereClause);
            const values = Object.values(whereClause);

            for (let index = 0; index < columns.length; index++) {

                let value = values[index];

                if (typeof value === 'string') {
                    value = `'${value}'`;
                }

                sql += `${columns[index]} = ${value}`;

                if (whereOperators != null && index < whereOperators.length) {
                    sql != ` ${whereOperators[index].toUpperCase()} `
                }
            }
        }

        sql += `;`;

        await this.database.query(sql)
            .then((results) => {
                output = results;
            })
            .catch((error) => {
                console.log(error);
            });

        return output;
    }

    async change(table, columns, values, whereClause, whereOperators, returningColumns) {
        let output;
        let sql = `UPDATE  ${table} SET `;

        if (columns.length !== values.length) {
            throw 'Invalid columns and values length';
        }

        for (let index = 0; index < columns.length; index++) {
            if (index > 0) {
                sql += ',';
            }

            if (typeof values[index] === 'string') {

                values[index] = `'${values[index]}'`;
            }

            sql += `${columns[index]} = ${values[index]}`;
        }

        if (whereClause == null) {
            throw 'Update must have a where clause';
        }

        sql += ` WHERE `;

        const WhereClauseColumns = Object.keys(whereClause);
        const WhereClauseValues = Object.values(whereClause);

        if (whereOperators != null && WhereClauseColumns.length - 1 !== whereOperators.length) {
            throw 'Invalid whereOperators length';
        }

        for (let index = 0; index < WhereClauseColumns.length; index++) {

            let value = WhereClauseValues[index];

            if (typeof value === 'string') {
                value = `'${value}'`;
            }

            sql += `${WhereClauseColumns[index]} = ${value}`;

            if (whereOperators != null && index < whereOperators.length) {
                sql != ` ${whereOperators[index].toUpperCase()} `
            }
        }

        if (returningColumns != null) {
            sql += ` RETURNING `;

            for (let index = 0; index < returningColumns.length; index++) {
                if (index > 0) {
                    sql += ',';
                }

                sql += returningColumns[index];
            }
        }

        sql += `;`;

        await this.database.query(sql)
            .then((results) => {
                output = results;
            })
            .catch((error) => {
                console.log(error);
            });

        return output;
    }

    async erase(table, whereClause, whereOperators, returningColumns) {
        let output;
        let sql = `DELETE FROM ${table}`;

        if (whereClause == null) {
            throw 'Update must have a where clause';
        }

        sql += ` WHERE `;

        const WhereClauseColumns = Object.keys(whereClause);
        const WhereClauseValues = Object.values(whereClause);

        if (whereOperators != null && WhereClauseColumns.length - 1 !== whereOperators.length) {
            throw 'Invalid whereOperators length';
        }

        for (let index = 0; index < WhereClauseColumns.length; index++) {

            let value = WhereClauseValues[index];

            if (typeof value === 'string') {
                value = `'${value}'`;
            }

            sql += `${WhereClauseColumns[index]} = ${value}`;

            if (whereOperators != null && index < whereOperators.length) {
                sql += ` ${whereOperators[index].toUpperCase()} `
            }
        }

        if (returningColumns != null) {
            sql += ` RETURNING `;

            for (let index = 0; index < returningColumns.length; index++) {
                if (index > 0) {
                    sql += ',';
                }

                sql += returningColumns[index];
            }
        }

        sql += `;`;

        await this.database.query(sql)
            .then((results) => {
                output = results;
            })
            .catch((error) => {
                console.log(error);
            });

        return output;
    }

    async insert(table, columns, values, returningColumns) {
        let output;
        let sql = `INSERT INTO  ${table}(`;

        for (let index = 0; index < columns.length; index++) {
            if (index > 0) {
                sql += ',';
            }

            sql += `${columns[index]}`;
        }

        sql += ') VALUES (';

        if (columns.length !== values.length) {
            throw 'Invalid columns and values arrays length. Length of columns and values must be equal.';
        }

        for (let index = 0; index < values.length; index++) {
            let value = values[index];

            if (typeof value === 'string') {
                value = `'${value}'`;
            }

            if (index > 0) {
                sql += ',';
            }

            sql += `${value}`;
        }

        if (returningColumns != null) {
            sql += `) RETURNING `;

            for (let index = 0; index < returningColumns.length; index++) {
                if (index > 0) {
                    sql += ',';
                }

                sql += returningColumns[index];
            }
        }

        sql += ';';

        await this.database.query(sql)
            .then((results) => {
                output = results;
            })
            .catch((error) => {
                console.log(error);
            });

        return output;
    }

    create(tableName) {
        const orm = new ORM(this.database);

        const object = {
            retrieve: async function (columns, whereClause, whereOperators) {
                return orm
                    .retrieve(tableName, columns, whereClause, whereOperators)
                    .catch((error) => {
                        console.log(error);
                    });
            },
            change: async function (columns, values, whereClause, whereOperators, returningColumns) {
                return orm
                    .change(tableName, columns, values, whereClause, whereOperators, returningColumns)
                    .catch((error) => {
                        console.log(error);
                    });
            },
            insert: async function (columns, values, returningColumns) {
                return orm
                    .insert(tableName, columns, values, returningColumns)
                    .catch((error) => {
                        console.log(error);
                    });
            },
            erase: async function (whereClause, whereOperators, returningColumns) {
                return orm
                    .erase(tableName, whereClause, whereOperators, returningColumns)
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }

        return object;
    }
}

export default ORM;