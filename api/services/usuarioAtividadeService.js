const { ConnectDB } = require('../../config/db');
const bcrypt = require('bcrypt');

const usuarioAtividadeInsert = `INSERT INTO usuarioAtividade VALUES($1, $2)`;
const usuarioAtividadeUpdate = `UPDATE usuarioAtividade SET`;
const usuarioAtividadeDelete = `DELETE FROM usuarioAtividade WHERE `;

const usuarioSelect = `SELECT u.idUsuario, u.nome, u.usuario, u.tipo, u.senha FROM usuarioAtividade ua JOIN usuario u ON (u.idusuario = ua.idusuario)`;

const SalvarUsuarioAtividade = async (idAtividade, usuario) => {
    try {
        const client = await ConnectDB();
        await client.query(usuarioAtividadeInsert, [idAtividade, usuario.idusuario]);
        client.end();

        return [true, 'Usuário salvo com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const RemoverUsuariosAtividade = async (idAtividade) => {
    try {
        const client = await ConnectDB();
        await client.query(`${usuarioAtividadeDelete} idAtividade = $1`, [idAtividade]);
        client.end();

        return [true, 'Usuários removidos com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const GetUsuariosByIdAtividade = async (idAtividade) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${usuarioSelect} WHERE ua.idAtividade = $1`, [idAtividade]);
        client.end();

        if (result.rows.length <= 0)
            return [null, 'Usuários atividades não encontrados.'];

        return [result.rows, 'Usuários da atividade encontrado.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
};



module.exports = {
    SalvarUsuarioAtividade,
    RemoverUsuariosAtividade,
    GetUsuariosByIdAtividade
}