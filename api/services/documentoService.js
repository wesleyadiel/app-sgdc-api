const { ConnectDB } = require('../../config/db');

const documentoInsert = `INSERT INTO documento VALUES($1, $2, $3, $4, $5, $6)`;
const documentoUpdate = `UPDATE documento SET`;
const documentoDelete = `DELETE FROM documento WHERE`;
const documentoSelect = `SELECT d.idDocumento, d.idTurma, t.nome AS turmaNome, d.tipo, d.descricao, to_char(d.data, 'DD/MM/YYYY') AS data, d.link FROM documento d JOIN turma t ON (t.idTurma = d.idTurma) `;

const GetNextId = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`SELECT COALESCE(MAX(idDocumento), 0) + 1 AS newId FROM documento`);
        client.end();

        return result.rows[0].newid;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const Salvar = async (documento) => {
    try {
        if (!documento.id) {
            const client = await ConnectDB();
            await client.query(documentoInsert, [await GetNextId(), documento.idTurma, documento.tipo, documento.descricao, documento.data, documento.link]);
            client.end();
        }
        else {
            const client = await ConnectDB();
            await client.query(`${documentoUpdate} idTurma = $1, tipo = $2, descricao = $3, data = $4, link = $5 WHERE idDocumento = $6`, [documento.idTurma, documento.tipo, documento.descricao, documento.data, documento.link, documento.id]);
            client.end();
        }

        return [true, 'Documento salvo com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const GetById = async (id) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${documentoSelect} WHERE idDocumento = ${id}`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Documento não encontrado.'];

        return [result.rows[0], 'Documento encontrado.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

const Buscar = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${documentoSelect} ORDER BY d.idDocumento`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Nenhum documento encontrado.'];

        return [result.rows, 'Documentos encontrados.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

const Remover = async (id) => {
    try {
        const client = await ConnectDB();
        await client.query(`${documentoDelete} idDocumento = $1`, [id]);
        client.end();

        return [true, 'Documento removido.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

module.exports = {
    GetNextId,
    Salvar,
    GetById,
    Buscar,
    Remover
}