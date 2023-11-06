const { ConnectDB } = require('../../config/db');

const atividadeInsert = `INSERT INTO atividade VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const atividadeUpdate = `UPDATE atividade SET`;
const atividadeDelete = `DELETE FROM atividade WHERE`;
const atividadeSelect = `SELECT a.idAtividade, a.idTurma, t.nome AS turmaNome, a.idUsuario, u.nome AS usuarioNome, a.descricao, a.complemento, a.observacao, to_char(a.dataInicio, 'DD/MM/YYYY') AS dataInicio, to_char(a.dataFim, 'DD/MM/YYYY') AS dataFim, a.status FROM atividade a JOIN turma t ON (t.idTurma = a.idTurma) JOIN usuario u ON (u.idUsuario = a.idUsuario) `;

const GetNextId = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`SELECT COALESCE(MAX(idAtividade), 0) + 1 AS newId FROM atividade`);
        client.end();

        return result.rows[0].newid;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const Salvar = async (atividade) => {
    try {
        if (!atividade.id) {
            atividade.id = await GetNextId();

            const client = await ConnectDB();
            await client.query(atividadeInsert, [atividade.id, atividade.idTurma, atividade.idUsuario, atividade.descricao, atividade.complemento, atividade.observacao, atividade.dataInicio, atividade.dataFim, atividade.status]);
            client.end();
        }
        else {
            const client = await ConnectDB();
            await client.query(`${atividadeUpdate} idTurma = $1, descricao = $2, complemento = $3, observacao = $4, dataInicio = $5, dataFim = $6, status = $7 WHERE idAtividade = $8`, [atividade.idTurma, atividade.descricao, atividade.complemento, atividade.observacao, atividade.dataInicio, atividade.dataFim, atividade.status, atividade.id]);
            client.end();
        }

        return [true, 'Atividade salvo com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const GetById = async (id) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${atividadeSelect} WHERE idAtividade = ${id}`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Atividade não encontrada.'];

        return [result.rows[0], 'Atividade encontrada.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

const Buscar = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${atividadeSelect} ORDER BY a.idAtividade`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Nenhuma atividade encontrada.'];

        return [result.rows, 'Atividades encontradas.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

const Remover = async (id) => {
    try {
        const client = await ConnectDB();
        await client.query(`${atividadeDelete} idAtividade = $1`, [id]);
        client.end();

        return [true, 'Atividade removida.'];
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