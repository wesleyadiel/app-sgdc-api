const {ConnectDB} = require('../../config/db');
const bcrypt = require('bcrypt');

const usuarioInsert = `INSERT INTO usuario VALUES($1, $2, $3, $4, $5)`;
const usuarioSelect = `SELECT idUsuario, nome, usuario, tipo, senha FROM usuario`;

const CriptografarSenha = async (senha) => {
    try {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_PASSWORD));
        const hash = bcrypt.hashSync(senha, salt);

        return hash;
    } catch (error) {
        return null;
    }
};

const GetNextId = async () => {
    try {
        const client = await ConnectDB();
        const result = await client.query(`SELECT COALESCE(MAX(idUsuario), 0) + 1 AS newId FROM usuario`);

        return result.rows[0].newid;
    } catch (error) {
        return null;
    }
};

const SalvarUsuario = async (usuario) => {
    try {
        const client = await ConnectDB();
        console.log([await GetNextId(), usuario.nome, usuario.usuario, (usuario.tipo ?? 'U'), await CriptografarSenha(usuario.senha)])
        await client.query(usuarioInsert, [await GetNextId(), usuario.nome, usuario.usuario, (usuario.tipo ?? 'U'), await CriptografarSenha(usuario.senha)]);

        return [true, 'Usuário salvo com sucesso!'];
    } catch (error) {
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
        if(valid)
            return [result.rows[0], 'Usuário encontrado.'];
        else
            return [null, 'Senha inválida.'];
    } catch (error) {
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
        return [true, error];
    }
}

const GetUserById = async (id) => {
    try {
        console.log(id);
        const client = await ConnectDB();
        const result = await client.query(`${usuarioSelect} WHERE idUsuario = ${id}`);
console.log('a')
        if (result.rows.length <= 0)
            return [null, 'Usuário não encontrado.'];

        return [result.rows[0], 'Usuário encontrado.'];
    } catch (error) {
        return [null, error];
    }
}

module.exports = {
    CriptografarSenha,
    GetNextId,
    SalvarUsuario,
    VerificarUsuario,
    ValidarUsuarioExistente,
    GetUserById
}