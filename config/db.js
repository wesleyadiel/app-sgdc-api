
const ConnectDB = async () => {
    if (global.connection)
        return global.connection.connect();
 
    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'sgdc',
        password: '8027',
        port: 5432
    });
 
    //apenas testando a conexão
    const client = await pool.connect();
 
    await client.query('SELECT NOW()');
    client.release();
 
    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

ConnectDB();

module.exports = {
    ConnectDB
}