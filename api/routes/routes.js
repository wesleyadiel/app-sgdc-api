const { Router } = require('express');
const router = Router();

const { Logar, Salvar, GetUserByToken, RedefinirSenha, GetUsuarios, GetUsuariosById, DeletarUsuario } = require('../controllers/login');
const {  SalvarTurma, GetTurmas, GetTurmaById, DeletarTurma } = require('../controllers/turmaController');
const {  SalvarCurso, GetCursos, GetCursoById, DeletarCurso } = require('../controllers/cursoController');
const {  SalvarDocumento, GetDocumentos, GetDocumentoById, DeletarDocumento } = require('../controllers/documentoController');
const {  SalvarAtividade, GetAtividades, GetAtividadeById, DeletarAtividade } = require('../controllers/atividadeController');
const {  GetPendenciaByIdUsuario, GetPendenciaByIdUsuarioHoje } = require('../controllers/pendenciaController');

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

//Documentos
router.get('/documentos', GetDocumentos);
router.post('/documento', SalvarDocumento);
router.get('/documento/:id', GetDocumentoById);
router.delete('/documento/:id', DeletarDocumento);

//Atividades
router.get('/atividades', GetAtividades);
router.post('/atividade', SalvarAtividade);
router.get('/atividade/:id', GetAtividadeById);
router.delete('/atividade/:id', DeletarAtividade);

//Pendencias
router.get('/pendencias/:idUsuario', GetPendenciaByIdUsuario);
router.get('/pendenciasHoje/:idUsuario', GetPendenciaByIdUsuarioHoje);



module.exports = router;