const { Router } = require('express');
const router = Router();

const { Logar, Salvar } = require('../controllers/login');

//Usuarios
router.post('/login', Logar);
router.post('/usuario', Salvar);


module.exports = router;