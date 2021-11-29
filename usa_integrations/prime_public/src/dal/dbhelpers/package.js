const { mysql, util } = require('../../utils/helper-functions/require-helper');

let creds = {
    host: "",
    port: 3306,
    database: "",
    password: "",
    name: "",
    user: "",
    connector: "mysql",
    connectTimeout: 100000,
    acquireTimeout: 50000,
    connectionLimit: 50,
};

const createConfiguration = (mysqlCreds) => {
    creds = { ...mysqlCreds };
    return poolConnection(creds);
};

let con;
let defaultCon;
// node native promisify
const initConnection = (mysqlCreds) => {
    defaultCon = poolConnection(mysqlCreds);
};

const poolConnection = (mysqlCreds) => {
    const functionName = "poolConnection";
    con = mysql.createPool(mysqlCreds);
    con.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        if (connection) connection.release();
    });
    return con;
};

const getSingleConnection = async (connection = con) => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err, sconnection) => {
            if (err) throw err;
            resolve(sconnection);
        });
    });
};

// function for fetching the details
const read = async (
    table,
    columns = "*",
    whereData = {},
    orderBy = false,
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    try {
        let query = `
            SELECT
                ${columns ? columns : `*`}
            FROM
                ${table} `;
        let whereCondition = " WHERE  1=1";
        if (Object.keys(whereData).length) {
            const keys = Object.keys(whereData);
            keys.map((v, k) => {
                whereCondition += ` And ${v} = '${whereData[v]}'`;
            });
        }
        query += whereCondition;
        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }
        return await connection.query(query);
    } catch (e) {
        // log.error('read', 'error in read query', e);
        throw new Error(e);
    }
};

// function for updating the table
const update = async (
    table,
    data = {},
    whereData = {},
    extraData = false,
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    if (Object.keys(whereData).length === 0 || whereData.constructor !== Object) {
        throw new Error("Required where clause for updating the table");
    }

    try {
        let extra = "";
        if (extraData) {
            extra = ` UpdatedDate = NOW()`;
        }
        let whereCondition = "";
        const keys = Object.keys(whereData);
        keys.map((v, k) => {
            whereCondition += ` ${k === 0 ? "" : " And"} ${v} = '${whereData[v]}'`;
        });

        const query = `
            UPDATE
                ${table}
            SET
                ? ${extra ? `,${extra}` : ""}
            WHERE
                ${whereCondition}
        `;
        const result = await connection.query(query, [data]);
        return result;
    } catch (e) {
        throw new Error(e);
    }
};

// function for inserting records
const create = async (
    table,
    data = {},
    extraData = false,
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    try {
        let extra = "";
        if (extraData) {
            extra = ` CreatedDate = NOW(),UpdatedDate = NOW()`;
        }
        const query = `
            INSERT INTO
                ${table}
            SET ?${extra ? `,${extra}` : ""}
        `;
        const result = await connection.query(query, [data]);
        return result;
    } catch (e) {
        throw new Error(e);
    }
};

// for executing any query
const execute = async (
    query,
    data = "",
    connection = defaultCon
) => {
    connection.query = util.promisify(connection.query);
    try {
        const result = await connection.query(query, data);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const startTransaction = async (connection) => {
    try {
        return await connection.beginTransaction();
    } catch (error) {
        throw error;
    }
};

const rollbackTransaction = async (connection) => {
    // console.log("connection in rollback",connection);
    try {
        // connection.rollback = util.promisify(connection.rollback);
        return await connection.rollback();
    } catch (error) {
        throw error;
    }
};

const commitTransaction = async (connection) => {
    try {
        return await connection.commit();
    } catch (error) {
        throw error;
    }
};

const releaseSingleConnection = async (connection) => {
    try {
        return await connection.release();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createConfiguration,
    read,
    update,
    create,
    execute,
    startTransaction,
    rollbackTransaction,
    commitTransaction,
    getSingleConnection,
    releaseSingleConnection,
    initConnection,
};
