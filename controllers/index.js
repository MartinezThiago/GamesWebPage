'use strict';
const gameAhorcado = require('../games/ahorcado.js');
const gameTateti = require('../games/tateti.js');
//*************************RUTAS DEL AHORCADO****************************************//
const ahorcadoGet = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    let comienzo = gameAhorcado.playAhorcado();
    if (comienzo) {
        res.json({ data: comienzo });
    }
});
const ahorcadoPost = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    res.json(gameAhorcado.duranteElJuego(req.body)); // el JSON que le mando por ajax le llega en el req.body al server {letra:"a"} letra es la key de abajo
});
const arriesgaPalabra = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    res.json(gameAhorcado.arriesga(req.body)); // el JSON que le mando por ajax le llega en el req.body al server {letra:"a"} letra es la key de abajo
});
const ahorcadoGanaste = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    let bool = gameAhorcado.validacionGanador(req.body);
    res.json({ data: bool }); // el JSON que le mando por ajax le llega en el req.body al server {letra:"a"} letra es la key de abajo
});
const terminarAhorcado = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    gameAhorcado.terminar(req.body);
    res.json(true); // el JSON que le mando por ajax le llega en el req.body al server {letra:"a"} letra es la key de abajo
});
//************************* FIN DE RUTAS DEL AHORCADO****************************************//




//*************************RUTAS DEL TATETI****************************************//

const tatetiboard = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    res.json(gameTateti.playTateti());
});

const tatetiboardSecondPlayer = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    res.json(gameTateti.playTatetiSecondPLayer(req.params.boardId));
});
//GET CONSTANTE PARA ACTUALIZAR TABLERO
const devolverTateti = ((req, res) => {
    res.json(gameTateti.estadoTateti(req.params.lecturaTablero));
});

const eliminar = ((req, res) => {
    res.json(gameTateti.terminar(req.params.eliminar));
});

const playFirstPlayer = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    res.json(gameTateti.tatetiJuegaFP(req.body))
});

const playSecondPlayer = ((req, res) => {//req(de navegador) la informacion que me envia el navegador y res(de servidor) la informacion que el servidor le envia al navegador
    res.json(gameTateti.tatetiJuegaSP(req.body))
});

//*************************FIN DE RUTAS DEL TATETI****************************************//

module.exports = {
    ahorcadoPost,
    ahorcadoGet,
    arriesgaPalabra,
    ahorcadoGanaste,
    tatetiboard,
    tatetiboardSecondPlayer,
    devolverTateti,
    playFirstPlayer,
    playSecondPlayer,
    eliminar,
    terminarAhorcado

}

