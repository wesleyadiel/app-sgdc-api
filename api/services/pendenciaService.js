const { ConnectDB } = require('../../config/db');

const atividadeSelect = `SELECT a.idAtividade, a.idTurma, t.nome AS turmaNome, c.nome as cursoNome, a.idUsuario, u.nome AS usuarioNome, a.descricao, a.complemento, a.observacao, to_char(a.dataInicio, 'DD/MM/YYYY') AS dataInicio, to_char(a.dataFim, 'DD/MM/YYYY') AS dataFim, a.status 
                            FROM atividade a 
                            JOIN turma t ON (t.idTurma = a.idTurma) 
                            JOIN curso c ON (c.idCurso = t.idCurso)
                            JOIN usuario u ON (u.idUsuario = a.idUsuario)
                            JOIN usuarioAtividade ua ON (ua.idAtividade = a.idAtividade) `;

const GetByIdUsuario = async (idUsuario) => {
    try {
        const client = await ConnectDB();
        console.log(`${atividadeSelect} WHERE ua.idUsuario = ${idUsuario}`)
        const result = await client.query(`${atividadeSelect} WHERE ua.idUsuario = ${idUsuario} AND a.status = 'A'`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Atividades não encontrada.'];

        return [result.rows, 'Atividades encontrada.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

const GetHojeByIdUsuario = async (idUsuario) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${atividadeSelect} WHERE ua.idUsuario = ${idUsuario} AND a.dataFim = CURRENT_DATE AND a.status = 'A'`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Atividades não encontrada.'];

        return [result.rows, 'Atividades encontrada.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

module.exports = {
    GetByIdUsuario,
    GetHojeByIdUsuario
}