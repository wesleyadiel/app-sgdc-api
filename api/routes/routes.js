const { Router } = require('express');
const router = Router();

const { Logar, Salvar, GetUserByToken, RedefinirSenha, GetUsuarios, GetUsuariosById, DeletarUsuario } = require('../controllers/login');

//Usuarios
router.post('/login', Logar);
router.post('/usuario', Salvar);
router.get('/usuario/token', GetUserByToken);
router.post('/redefinirSenha', RedefinirSenha);
router.get('/usuarios', GetUsuarios);
router.get('/usuarios/:id', GetUsuariosById);
router.delete('/usuario/:id', DeletarUsuario);


module.exports = router;