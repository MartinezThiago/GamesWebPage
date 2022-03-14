const express = require('express');
const router = express.Router();//Nos devuelve un objeto de js y ahi vamos a almacenar las rutas

const IndexController = require('../controllers/index.js');


//rutas ahorcado
router.get('/ahorcado', IndexController.ahorcadoGet);
router.post('/ahorcado/jugar', IndexController.ahorcadoPost);
router.post('/ahorcado/ganaste', IndexController.ahorcadoGanaste);
router.post('/ahorcado/arriesga', IndexController.arriesgaPalabra);
router.post("/ahorcado/terminar",IndexController.terminarAhorcado);
//fin de rutas ahorcado

//rutas tateti
router.get('/tateti/board', IndexController.tatetiboard);// obtengo el id del tablero y pongo en el input
router.get('/tateti/board/:boardId', IndexController.tatetiboardSecondPlayer);//  devolves tablero para poder dibujarlo
router.get('/tateti/board/LecturaTablero/:lecturaTablero', IndexController.devolverTateti);
router.delete('/tateti/board/:eliminar', IndexController.eliminar);

//router.post('/tateti/boardPostFP', IndexController.playFirstPlayer);

router.post('/tateti/play', IndexController.playFirstPlayer);
router.post('/tateti/:boardId/play', IndexController.playSecondPlayer)

//router.post('/tateti/boardPostSP', IndexController.playSecondPlayer);
//fin de rutas tateti

module.exports = router;