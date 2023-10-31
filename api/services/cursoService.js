const { ConnectDB } = require('../../config/db');

const cursoInsert = `INSERT INTO curso VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
const cursoUpdate = `UPDATE curso SET`;
const cursoDelete = `DELETE FROM curso WHERE`;
const cursoSelect = `SELECT c.idCurso, c.nome, c.idUsuarioCoordenador, c.periodo, c.cargaHoraria, c.projetoPedagogico, c.aprovacaoCogep, c.ataColegiado FROM curso c `;
const cursoSelectListagem = `SELECT c.idCurso, c.nome, c.idUsuarioCoordenador, u.nome AS nomeCoordenador, c.periodo, c.cargaHoraria, c.projetoPedagogico, c.aprovacaoCogep, c.ataColegiado FROM curso c LEFT JOIN usuario u ON (c.idUsuarioCoordenador = u.idUsuario) `;

const GetNextId = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`SELECT COALESCE(MAX(idCurso), 0) + 1 AS newId FROM curso`);
        client.end();

        return result.rows[0].newid;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const Salvar = async (curso) => {
    try {
        if (!curso.id) {
            const client = await ConnectDB();
            await client.query(cursoInsert, [await GetNextId(), curso.nome, curso.periodo, curso.cargaHoraria, curso.projetoPedagogico, curso.aprovacaoCogep, curso.ataColegiado, curso.idUsuarioCoordenador]);
            client.end();
        }
        else {
            const client = await ConnectDB();
            await client.query(`${cursoUpdate} nome = $1, idUsuarioCoordenador = $2, periodo = $3, cargaHoraria = $4, projetoPedagogico = $5, aprovacaoCogep = $6, ataColegiado = $7 WHERE idCurso = $8`, [curso.nome, curso.idUsuarioCoordenador, curso.periodo, curso.cargaHoraria, curso.projetoPedagogico, curso.aprovacaoCogep, curso.ataColegiado, curso.id]);
            client.end();
        }

        return [true, 'Curso salvo com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const GetById = async (id) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${cursoSelect} WHERE idCurso = ${id}`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Curso não encontrada.'];

        return [result.rows[0], 'Curso encontrado.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

const Buscar = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${cursoSelectListagem} ORDER BY c.idCurso`);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Nenhum curso encontrado.'];

        return [result.rows, 'Cursos encontrados.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

const Remover = async (id) => {
    try {
        const client = await ConnectDB();
        await client.query(`${cursoDelete} idCurso = $1`, [id]);
        client.end();

        return [true, 'Curso removido.'];
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