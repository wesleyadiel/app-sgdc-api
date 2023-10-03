const { VerificarUsuario, SalvarUsuario, ValidarUsuarioExistente } = require('../services/usuario');

const Logar = async (req, res) => {
  var [usuario, message] = await VerificarUsuario(req.body.usuario, req.body.senha);
  if (!usuario)
    return res.status(400).json(message);

  return res.status(200).json(usuario);
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

module.exports = {
  Logar,
  Salvar
}