const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { VerificarUsuario, SalvarUsuario, ValidarUsuarioExistente, GetUserById, CriptografarSenha, AtualizarSenha, BuscarUsuários, RemoverUsuario } = require('../services/usuario');

const Logar = async (req, res) => {
  var [usuario, message] = await VerificarUsuario(req.body.usuario, req.body.senha);

  if (!usuario)
    return res.status(400).json(message);

  const primeiroAcesso = await bcrypt.compare(process.env.FIRST_PASSWORD, usuario.senha);

  const token = jwt.sign({ id: usuario.idusuario }, process.env.SECRET_TOKEN, {
    expiresIn: 1800
  });

  return res.status(200).json({ usuario, token, primeiroAcesso });
};

const Salvar = async (req, res) => {
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
    return res.status(400).json(`Nome de usuário não informado.`);

  if (!req.body.usuario)
    return res.status(400).json(`Usuário não informado.`);

  if (!req.body.tipo)
    return res.status(400).json(`Tipo de usuário não informado.`);

  req.body.senha = process.env.FIRST_PASSWORD;

  if (!req.body.id) {
    const [usuarioUtilizado, messageValidar] = await ValidarUsuarioExistente(req.body.usuario);
    if (usuarioUtilizado)
      return res.status(400).json(messageValidar);
  }

  var [isSaved, message] = await SalvarUsuario(req.body);
  if (!isSaved)
    return res.status(500).json(message);

  return res.status(200).json(message);
};

const GetUserByToken = async (req, res) => {
  const token = req.headers.authorization;
  var dataToken = null;

  try {
    dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);
    if (!dataToken)
      return res.status(403).json("Token inválido.")

  } catch (error) {
    return res.status(403).json("Token inválido. " + error)
  }

  const [user, message] = await GetUserById(dataToken.id);
  if (!user)
    return res.status(400).json(message)

  return res.status(200).json(user)
}

const RedefinirSenha = async (req, res) => {
  const token = req.headers.authorization;
  var dataToken = null;

  try {
    dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

    if (!dataToken)
      return res.status(403).json("Token inválido.")
  } catch (error) {
    return res.status(403).json("Token inválido. " + error)
  }

  if (!req.body.senha)
    return res.status(400).json("Senha não informada.");

  const senhaPadrao = await bcrypt.compare(req.body.senha, await CriptografarSenha(process.env.FIRST_PASSWORD));
  if (senhaPadrao)
    return res.status(400).json("Insira uma senha diferente da padrão.");

  const [retorno, message] = await AtualizarSenha(dataToken.id, req.body.senha);
  if (!retorno)
    return res.status(400).json(message);

  return res.status(200).json(message);
}

const GetUsuarios = async (req, res) => {
  const token = req.headers.authorization;
  var dataToken = null;

  try {
    dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

    if (!dataToken)
      return res.status(403).json("Token inválido.")
  } catch (error) {
    return res.status(403).json("Token inválido. " + error)
  }

  const [retorno, message] = await BuscarUsuários();
  if (!retorno)
    return res.status(400).json(message);

  return res.status(200).json(retorno);
}

const GetUsuariosById = async (req, res) => {
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
    return res.status(400).json("Usuário inválido.");

  const [retorno, message] = await GetUserById(req.params.id);
  if (!retorno)
    return res.status(400).json(message);

  return res.status(200).json(retorno);

}

const DeletarUsuario = async (req, res) => {
  const token = req.headers.authorization;
  var dataToken = null;

  try {
    dataToken = await jwt.verify(token, process.env.SECRET_TOKEN);

    if (!dataToken)
      return res.status(403).json("Token inválido.")
  } catch (error) {
    return res.status(403).json("Token inválido. " + error)
  }

  if (!req.body.id)
    return res.status(400).json("Usuário inválido.");

  const [retorno, message] = await RemoverUsuario(req.body.id);
  if (!retorno)
    return res.status(400).json(message);

  return res.status(200).json(message);

}


module.exports = {
  Logar,
  Salvar,
  GetUserByToken,
  RedefinirSenha,
  GetUsuarios,
  GetUsuariosById,
  DeletarUsuario
}