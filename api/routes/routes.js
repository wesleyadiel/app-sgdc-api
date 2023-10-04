const { Router } = require('express');
const router = Router();

const { Logar, Salvar, GetUserByToken } = require('../controllers/login');

//Usuarios
router.post('/login', Logar);
router.post('/usuario', Salvar);
router.get('/usuario/token/:token', GetUserByToken);


module.exports = router;