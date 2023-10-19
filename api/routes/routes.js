const { Router } = require('express');
const router = Router();

const { Logar, Salvar, GetUserByToken, RedefinirSenha, GetUsuarios, GetUsuariosById, DeletarUsuario } = require('../controllers/login');
const {  SalvarTurma, GetTurmas, GetTurmaById, DeletarTurma } = require('../controllers/turmaController');
const {  SalvarCurso, GetCursos, GetCursoById, DeletarCurso } = require('../controllers/cursoController');

//Usuarios
router.post('/login', Logar);
router.post('/usuario', Salvar);
router.get('/usuario/token', GetUserByToken);
router.post('/redefinirSenha', RedefinirSenha);
router.get('/usuarios', GetUsuarios);
router.get('/usuario/:id', GetUsuariosById);
router.delete('/usuario/:id', DeletarUsuario);

//Turmas
router.get('/turmas', GetTurmas);
router.post('/turma', SalvarTurma);
router.get('/turma/:id', GetTurmaById);
router.delete('/turma/:id', DeletarTurma);

//Cursos
router.get('/cursos', GetCursos);
router.post('/curso', SalvarCurso);
router.get('/curso/:id', GetCursoById);
router.delete('/curso/:id', DeletarCurso);



module.exports = router;