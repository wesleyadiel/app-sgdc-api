const { ConnectDB } = require('../../config/db');
const bcrypt = require('bcrypt');

const usuarioInsert = `INSERT INTO usuario VALUES($1, $2, $3, $4, $5)`;
const usuarioUpdate = `UPDATE usuario SET`;
const usuarioDelete = `DELETE FROM usuario WHERE`;
const usuarioSelect = `SELECT idUsuario, nome, usuario, tipo, senha FROM usuario`;

const CriptografarSenha = async (senha) => {
    try {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_PASSWORD));
        const hash = bcrypt.hashSync(senha, salt);

        return hash;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const GetNextId = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`SELECT COALESCE(MAX(idUsuario), 0) + 1 AS newId FROM usuario`);

        return result.rows[0].newid;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const SalvarUsuario = async (usuario) => {
    try {
        if (!usuario.id) {
            const client = await ConnectDB();
            await client.query(usuarioInsert, [await GetNextId(), usuario.nome, usuario.usuario, (usuario.tipo ?? 'P'), await CriptografarSenha(usuario.senha)]);
        }
        else {
            const client = await ConnectDB();
            await client.query(`${usuarioUpdate} nome = $1, usuario = $2, tipo = $3 WHERE idUsuario = $4`, [usuario.nome, usuario.usuario, (usuario.tipo ?? 'P'), usuario.id]);
        }

        return [true, 'Usuário salvo com sucesso!'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
};

const VerificarUsuario = async (usuario, senha) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${usuarioSelect} WHERE usuario = '${usuario}'`);

        if (result.rows.length <= 0)
            return [null, 'Usuário não encontrado.'];

        const valid = await bcrypt.compare(senha, result.rows[0].senha);
        if (valid)
            return [result.rows[0], 'Usuário encontrado.'];
        else
            return [null, 'Senha inválida.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
};

const ValidarUsuarioExistente = async (usuario) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${usuarioSelect} WHERE usuario = '${usuario}'`);

        if (result.rows.length <= 0)
            return [false, 'Usuário disponível.'];

        return [true, 'Usuário já utilizado.'];
    } catch (error) {
        console.log(error)
        return [true, error];
    }
}

const GetUserById = async (id) => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`${usuarioSelect} WHERE idUsuario = ${id}`);

        if (result.rows.length <= 0)
            return [null, 'Usuário não encontrado.'];

        return [result.rows[0], 'Usuário encontrado.'];
    } catch (error) {
        console.log(error)
        return [null, error];
    }
}

const AtualizarSenha = async (idUsuario, senha) => {
    try {
        const client = await ConnectDB();
        await client.query(`${usuarioUpdate} senha = $1 WHERE idUsuario = $2`, [await CriptografarSenha(senha), idUsuario]);

        return [true, 'Senha atualizada.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

const BuscarUsuários = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(usuarioSelect);

        if (result.rows.length <= 0)
            return [null, 'Nenhum usuários encontrado.'];

        return [result.rows, 'Usuários encontrados.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

const RemoverUsuario = async (id) => {
    try {
        const client = await ConnectDB();
        await client.query(`${usuarioDelete} idUsuario = $1`, [id]);

        return [true, 'Usuário removido.'];
    } catch (error) {
        console.log(error)
        return [false, error];
    }
}

module.exports = {
    CriptografarSenha,
    GetNextId,
    SalvarUsuario,
    VerificarUsuario,
    ValidarUsuarioExistente,
    GetUserById,
    AtualizarSenha,
    BuscarUsuários,
    RemoverUsuario
}