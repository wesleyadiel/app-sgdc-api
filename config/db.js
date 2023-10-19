var conectionsGlobalCount = 0;
const ConnectDB = async () => {
    if (global.connection && conectionsGlobalCount < 6)
    {
        conectionsGlobalCount++;
        return global.connection.connect();
    }
 
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
 
    global.connection = pool;

    conectionsGlobalCount = 0
    return pool.connect();
}

module.exports = {
    ConnectDB
}