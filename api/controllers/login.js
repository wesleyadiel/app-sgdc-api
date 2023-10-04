const jwt = require('jsonwebtoken');

const { VerificarUsuario, SalvarUsuario, ValidarUsuarioExistente, GetUserById } = require('../services/usuario');

const Logar = async (req, res) => {
  var [usuario, message] = await VerificarUsuario(req.body.usuario, req.body.senha);
  if (!usuario)
    return res.status(400).json(message);

  const token = jwt.sign({ id: usuario.idusuario }, process.env.SECRET_TOKEN, {
    expiresIn: 1800
  });

  return res.status(200).json({ usuario, token });
};

const Salvar = async (req, res) => {
  if (!req.body.nome)
    return res.status(400).json(`Nome de usuário não informado.`);

  if (!req.body.usuario)
    return res.status(400).json(`Usuário não informado.`);

  if (!req.body.senha)
    return res.status(400).json(`Senha do usuário não informado.`);

  const [usuarioUtilizado, messageValidar] = await ValidarUsuarioExistente(req.body.usuario);
  if (usuarioUtilizado)
    return res.status(400).json(messageValidar);

  var [isSaved, message] = await SalvarUsuario(req.body);
  if (!isSaved)
    return res.status(500).json(message);

  return res.status(200).json(message);
};

const GetUserByToken = async (req, res) => {
  const token = req.params.token;
  var dataToken = null;

  try {
    dataToken = jwt.verify(token, process.env.SECRET_TOKEN);
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

module.exports = {
  Logar,
  Salvar,
  GetUserByToken
}