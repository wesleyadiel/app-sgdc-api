
const jwt = require('jsonwebtoken');
const { Salvar, GetById, Buscar, Remover } = require('../services/documentoService');

const SalvarDocumento = async (req, res) => {
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

    if (!req.body.tipo)
        return res.status(400).json(`Tipo não informado.`);

    if (!req.body.descricao)
        return res.status(400).json(`Descrição não informada.`);

    if (!req.body.data)
        return res.status(400).json(`Data não informada.`);

    if (!req.body.link)
        return res.status(400).json(`Link não informado.`);

    var [isSaved, message] = await Salvar(req.body);
    if (!isSaved)
        return res.status(500).json(message);

    return res.status(200).json(message);
};

const GetDocumentos = async (req, res) => {
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

const GetDocumentoById = async (req, res) => {
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
        return res.status(400).json("Documento inválido.");

    const [retorno, message] = await GetById(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(retorno);

}

const DeletarDocumento = async (req, res) => {
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
        return res.status(400).json("Documento inválido.");

    const [retorno, message] = await Remover(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(message);

}


module.exports = {
    SalvarDocumento,
    GetDocumentos,
    GetDocumentoById,
    DeletarDocumento
}