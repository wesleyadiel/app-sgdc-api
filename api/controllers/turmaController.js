
const jwt = require('jsonwebtoken');
const { Salvar, GetById, Buscar, Remover } = require('../services/turmasService');

const SalvarTurma = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.body.idCurso)
        return res.status(400).json(`Curso não informado.`);

    if (!req.body.nome)
        return res.status(400).json(`Nome da turma não informado.`);

    if (!req.body.dataInicio)
        return res.status(400).json(`Data de inicio não informada.`);

    if (!req.body.dataFim)
        return res.status(400).json(`Data de fim não informada.`);

    if (!req.body.planilha)
        return res.status(400).json(`Planilha não informada.`);

    if (!req.body.solicitacaoAbertura)
        return res.status(400).json(`Solicitação de abertura não informada.`);

    if (!req.body.idUsuarioCoordenador)
        return res.status(400).json(`Coordenador não informado.`);

    if (!req.body.idUsuarioSecretario)
        return res.status(400).json(`Secretario não informado.`);

    if (!req.body.idUsuarioGestorContrato)
        return res.status(400).json(`Gestor de contrato não informado.`);

    if (!req.body.idUsuarioFiscalContrato)
        return res.status(400).json(`Fiscal de contrato não informado.`);

    var [isSaved, message] = await Salvar(req.body);
    if (!isSaved)
        return res.status(500).json(message);

    return res.status(200).json(message);
};

const GetTurmas = async (req, res) => {
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

const GetTurmaById = async (req, res) => {
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
        return res.status(400).json("Turma inválida.");

    const [retorno, message] = await GetById(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(retorno);

}

const DeletarTurma = async (req, res) => {
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
        return res.status(400).json("Turma inválida.");

    const [retorno, message] = await Remover(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(message);

}


module.exports = {
    SalvarTurma,
    GetTurmas,
    GetTurmaById,
    DeletarTurma
}