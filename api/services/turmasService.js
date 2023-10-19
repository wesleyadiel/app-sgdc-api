const { ConnectDB } = require('../../config/db');

const turmaInsert = `INSERT INTO turma VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
const turmaUpdate = `UPDATE turma SET`;
const turmaDelete = `DELETE FROM turma WHERE`;
const turmaSelect = `SELECT t.idTurma, t.idCurso, t.nome, to_char(t.dataInicio, 'DD/MM/YYYY') AS dataInicio, to_char(t.dataFim, 'DD/MM/YYYY') AS dataFim, t.planilha, t.solicitacaoAbertura, t.idUsuarioCoordenador, t.idUsuarioSecretario, t.idUsuarioGestorContrato, t.idUsuarioFiscalContrato FROM turma t `;
const turmaSelectListagem = `SELECT t.idTurma, t.idCurso, t.nome, c.nome AS nomeCurso, to_char(t.dataInicio, 'DD/MM/YYYY') AS dataInicio, to_char(t.dataFim, 'DD/MM/YYYY') AS dataFim, t.planilha, t.solicitacaoAbertura, t.idUsuarioCoordenador, u_c.nome AS nomeCoordenador, t.idUsuarioSecretario, u_s.nome AS nomeSecretario, t.idUsuarioGestorContrato, u_g.nome AS nomeGestor, t.idUsuarioFiscalContrato, u_f.nome AS nomeFiscal FROM turma t LEFT JOIN curso c ON (c.idCurso = t.idCurso) LEFT JOIN usuario u_c ON (t.idUsuarioCoordenador = u_c.idUsuario) LEFT JOIN usuario u_s ON (t.idUsuarioSecretario = u_s.idUsuario) LEFT JOIN usuario u_g ON (t.idUsuarioGestorContrato = u_g.idUsuario) LEFT JOIN usuario u_f ON (t.idUsuarioFiscalContrato = u_f.idUsuario) `;

const GetNextId = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`SELECT COALESCE(MAX(idTurma), 0) + 1 AS newId FROM turma`);
        client.end();

        return result.rows[0].newid;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const Salvar = async (turma) => {
    try {
        if (!turma.id) {
            const client = await ConnectDB();
            await client.query(turmaInsert, [await GetNextId(), turma.idCurso, turma.nome, turma.dataInicio, turma.dataFim, turma.planilha, turma.solicitacaoAbertura, turma.idUsuarioCoordenador, turma.idUsuarioSecretario, turma.idUsuarioGestorContrato, turma.idUsuarioFiscalContrato]);
            client.end();
        }
        else {
            const client = await ConnectDB();
            await client.query(`${turmaUpdate} idCurso = $1, nome = $2, dataInicio = $3, dataFim = $4, planilha = $5, solicitacaoAbertura = $6, idUsuarioCoordenador = $7, idUsuarioSecretario = $8, idUsuarioGestorContrato = $9, idUsuarioFiscalContrato = $10 WHERE idTurma = $11`, [turma.idCurso, turma.nome, turma.dataInicio, turma.dataFim, turma.planilha, turma.solicitacaoAbertura, turma.idUsuarioCoordenador, turma.idUsuarioSecretario, turma.idUsuarioGestorContrato, turma.idUsuarioFiscalContrato, turma.id]);
            client.end();
        }

        return [true, 'Turma salva com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const GetById = async (id) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${turmaSelect} WHERE idTurma = ${id}`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Turma não encontrada.'];

        return [result.rows[0], 'Turma encontrada.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

const Buscar = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${turmaSelectListagem} ORDER BY t.idTurma`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Nenhum usuários encontrado.'];

        return [result.rows, 'Usuários encontrados.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

const Remover = async (id) => {
    try {
        const client = await ConnectDB();
        await client.query(`${turmaDelete} idTurma = $1`, [id]);
        client.end();

        return [true, 'Turma removida.'];
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