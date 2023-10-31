
const jwt = require('jsonwebtoken');
const { Salvar, GetById, Buscar, Remover } = require('../services/cursoService');

const SalvarCurso = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.body.nome)
        return res.status(400).json(`Nome não informado.`);

    if (!req.body.idUsuarioCoordenador)
        return res.status(400).json(`Coordenador não informado.`);

    if (!req.body.periodo)
        return res.status(400).json(`Periodo não informado.`);

    if (!req.body.cargaHoraria)
        return res.status(400).json(`Carga horária não informada.`);

    if (!req.body.projetoPedagogico)
        return res.status(400).json(`Projeto pedagogico não informado.`);

    if (!req.body.aprovacaoCogep)
        return res.status(400).json(`Aprovação COGEP não informada.`);

    if (!req.body.ataColegiado)
        return res.status(400).json(`Ata colegiado não informada.`);

    var [isSaved, message] = await Salvar(req.body);
    if (!isSaved)
        return res.status(500).json(message);

    return res.status(200).json(message);
};

const GetCursos = async (req, res) => {
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

const GetCursoById = async (req, res) => {
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
        return res.status(400).json("Curso inválido.");

    const [retorno, message] = await GetById(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(retorno);

}

const DeletarCurso = async (req, res) => {
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
        return res.status(400).json("Curso inválido.");

    const [retorno, message] = await Remover(req.params.id);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(message);

}


module.exports = {
    SalvarCurso,
    GetCursos,
    GetCursoById,
    DeletarCurso
}