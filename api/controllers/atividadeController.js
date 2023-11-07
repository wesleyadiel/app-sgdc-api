
const jwt = require('jsonwebtoken');
const { Salvar, GetById, Buscar, Remover } = require('../services/atividadeService');
const { SalvarUsuarioAtividade, RemoverUsuariosAtividade, GetUsuariosByIdAtividade } = require('../services/usuarioAtividadeService');

const SalvarAtividade = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.body.idTurma)
        return res.status(400).json(`Turma não informada.`);

    if (!req.body.idUsuario)
        return res.status(400).json(`Usuário criador da atividade não informado.`);

    if (!req.body.descricao)
        return res.status(400).json(`Descrição não informada.`);

    if (!req.body.complemento)
        return res.status(400).json(`Complemento não informado.`);

    if (!req.body.observacao)
        return res.status(400).json(`Observação não informada.`);

    if (!req.body.dataInicio)
        return res.status(400).json(`Data início não informada.`);

    if (!req.body.dataFim)
        return res.status(400).json(`Data fim não informada.`);

    if (!req.body.status)
        return res.status(400).json(`Status não informada.`);

    if (req.body.usuariosRelacionados.length <= 0)
        return res.status(400).json(`Nenhum usuário relacionado.`);

    var [isSaved, message] = await Salvar(req.body);
    if (!isSaved)
        return res.status(500).json(message);

    await RemoverUsuariosAtividade(req.body.id);
    req.body.usuariosRelacionados.forEach(async (item) => {
        await SalvarUsuarioAtividade(req.body.id, item);
    });

    return res.status(200).json(message);
};

const GetAtividades = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    const [retorno, message] = await Buscar();
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(retorno);
}

const GetAtividadeById = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.params.id)
        return res.status(400).json("Atividade inválida.");

    const [retorno, message] = await GetById(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    const [retornoUsuarioAtividade, usuariosAtividadeMessage] = await GetUsuariosByIdAtividade(req.params.id);
    retorno.usuariosRelacionados = retornoUsuarioAtividade;

    return res.status(200).json(retorno);
}

const DeletarAtividade = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.params.id)
        return res.status(400).json("Atividade inválida.");

    const [retorno, message] = await Remover(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(message);

}


module.exports = {
    SalvarAtividade,
    GetAtividades,
    GetAtividadeById,
    DeletarAtividade
}