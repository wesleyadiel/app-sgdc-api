
const jwt = require('jsonwebtoken');
const { GetByIdUsuario, GetHojeByIdUsuario } = require('../services/pendenciaService');

const GetPendenciaByIdUsuario = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.params.idUsuario)
        return res.status(400).json("IdUsuário inválida.");

    const [retorno, message] = await GetByIdUsuario(req.params.idUsuario);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(retorno);
}

const GetPendenciaByIdUsuarioHoje = async (req, res) => {
    const token = req.headers.authorization;
    var dataToken = null;

    try {
        dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

        if (!dataToken)
            return res.status(403).json("Token inválido.")
    } catch (error) {
        return res.status(403).json("Token inválido. " + error)
    }

    if (!req.params.idUsuario)
        return res.status(400).json("IdUsuário inválida.");

    const [retorno, message] = await GetHojeByIdUsuario(req.params.idUsuario);
    if (!retorno)
        return res.status(400).json(message);

    return res.status(200).json(retorno);
}


module.exports = {
    GetPendenciaByIdUsuario,
    GetPendenciaByIdUsuarioHoje
}