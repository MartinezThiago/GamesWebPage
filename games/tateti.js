'use strict';
const fs = require('file-system');
const crypto = require('crypto');
const url = 'InfoTateti.json';

function tatetiboard() {
    //GENERO BOARDID  E IDS DE LA PARTIDA ALEATORIA
    const boardId = crypto.randomBytes(16).toString('hex');
    const playerIdOne = crypto.randomBytes(16).toString('hex');
    const playerIdTwo = crypto.randomBytes(16).toString('hex');
    //FIN DE BOARDID  E IDS DE LA PARTIDA ALEATORIA

    var tateti = new Object();
    var tatetiQueDevuelvo = new Object();
    if((boardId)&&(playerIdOne)&&(playerIdTwo)){
        //***objeto que subo en el json del tateti*/
        tateti.playerIdOne = playerIdOne;
        tateti.playerIdTwo = playerIdTwo;
        tateti.ganador = " ";
        tateti.boardId = boardId;
        tateti.turno = "X";
        tateti.idGanador = "";
        tateti.tablero = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
        tateti.cantJugadores = 1;
        //*** fin objeto que subo en el json del tateti*/

        //***estrutuctura del json */
        var data = JSON.parse(fs.readFileSync(url, 'utf-8'));
        data.push(tateti);
        var tateti_json = JSON.stringify(data);//JSON.stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON
        fs.writeFileSync(url, tateti_json, 'utf-8');//escribimos en disco
        //***fin de estrutuctura del json */

        tatetiQueDevuelvo.id = tateti.playerIdOne;
        tatetiQueDevuelvo.ganador = tateti.ganador;
        tatetiQueDevuelvo.boardId = tateti.boardId;
        tatetiQueDevuelvo.turno = tateti.turno;
        tatetiQueDevuelvo.tablero = tateti.tablero;
        tatetiQueDevuelvo.cantJugadores = tateti.cantJugadores;
        tatetiQueDevuelvo.error=""
    }else{
        tatetiQueDevuelvo.error=400;
    }

    return (tatetiQueDevuelvo);
}

function tatetiboardParameter(id) {
    var tateti = new Object();
    tateti.cantJugadores = 1;
    tateti.boardId = id;
    tateti.turno = "O";
    tateti.tablero = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
    tateti.error="";
    var tatetiJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = tatetiJSON.findIndex(e => e.boardId == id);
    if(validacionIDs(tatetiJSON[posId].boardId,tatetiJSON[posId].playerIdTwo)){
        if (tatetiJSON[posId].cantJugadores < 2) {
            tatetiJSON[posId].cantJugadores = tatetiJSON[posId].cantJugadores + 1;
            tateti.cantJugadores = tateti.cantJugadores + 1;
            fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
            tateti.id = tatetiJSON[posId].playerIdTwo;
        }
    }
    else{
        tateti.error=400;
    }
    return (tateti);
}
function validacionIDs(boardId,PlayerId){
    var tatetiJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posBoardId = tatetiJSON.findIndex(e => e.boardId == boardId);
    let posPlayerId = tatetiJSON.findIndex(e => e.playerIdTwo == PlayerId);
    if((posPlayerId != -1)&&(posBoardId != -1)){
        return true;
    }else{
        return false;
    }
}

function tatetiJuegaFP(data) {
    var firstPlayer = new Object();
    firstPlayer.estadoDelJuego = "";
    firstPlayer.ganador = " ";
    let tatetiJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = tatetiJSON.findIndex(e => e.boardId == data.bID);
    if (tatetiJSON[posId].cantJugadores != 1) {
        if (tatetiJSON[posId].turno == "X") {
            if (tatetiJSON[posId].tablero[data.fila][data.columna] == " ") {
                tatetiJSON[posId].tablero[data.fila][data.columna] = "X";
                tatetiJSON[posId].turno = "O";
                fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
                firstPlayer.tablero = tatetiJSON[posId].tablero;
                firstPlayer.turno = "O";
                if (resultadosParaX(tatetiJSON[posId])) {
                    tatetiJSON[posId].ganador = "X";
                    tatetiJSON[posId].idGanador = tatetiJSON[posId].playerIdOne;
                    firstPlayer.idGanador = tatetiJSON[posId].idPlayerOne;
                    firstPlayer.ganador = "X";
                    fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
                }
                return ({ data: firstPlayer });

            }
            else {
                firstPlayer.estadoDelJuego = "OCUPADO"
                return ({ data: firstPlayer });
            }
        } else {
            firstPlayer.estadoDelJuego = "INVALIDO"
            return ({ data: firstPlayer });// codigo que indica que no es tu turno
        }
    } else {
        firstPlayer.estadoDelJuego = "ESPERA"
        return ({ data: firstPlayer })
    }


}

function tatetiJuegaSP(data) {
    var secondPlayer = new Object();
    secondPlayer.estadoDelJuego = "";
    secondPlayer.ganador = " ";
    let tatetiJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = tatetiJSON.findIndex(e => e.boardId == data.bID);
    if (tatetiJSON[posId].turno == "O") {
        if (tatetiJSON[posId].tablero[data.fila][data.columna] == " ") {
            tatetiJSON[posId].tablero[data.fila][data.columna] = "O";
            tatetiJSON[posId].turno = "X";
            fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
            secondPlayer.tablero = tatetiJSON[posId].tablero;
            secondPlayer.turno = "X";
            if (resultadosParaO(tatetiJSON[posId])) {
                tatetiJSON[posId].ganador = "O";
                tatetiJSON[posId].idGanador = tatetiJSON[posId].playerIdTwo;
                secondPlayer.idGanador = tatetiJSON[posId].idPlayerTwo;
                secondPlayer.ganador = "O";
                fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
            }
            return ({ data: secondPlayer });
        }
        else {
            secondPlayer.estadoDelJuego = "OCUPADO"
            return ({ data: secondPlayer });
        }
    } else {
        secondPlayer.estadoDelJuego = "INVALIDO"
        return ({ data: secondPlayer });// codigo que indica que no es tu turno
    }
}

function resultadosParaX(data) {
    var result;
    result = resultadosX(data);
    return result;
}

function resultadosX(data) {
    var vector = data.tablero;
    var cantidad1 = 0;
    var cantidad2 = 0;
    for (var i = 0; i < vector.length; i++) {
        for (var j = 0; j < vector.length; j++) {
            if (vector[i][j] == "X") {
                cantidad1++;
            }
            if (vector[j][i] == "X") {
                cantidad2++;
            }
        }
        if ((cantidad1 === 3) || (cantidad2 === 3)) {
            return true;
        }
        if (((vector[0][0] == "X") && (vector[1][1] == "X") && (vector[2][2] == "X")) || ((vector[0][2] == "X") && (vector[1][1] == "X") && (vector[2][0] == "X"))) {
            return true;
        }
        cantidad1 = 0;
        cantidad2 = 0;
    }

    return false;
}

function resultadosParaO(data) {
    var result;
    result = resultadosO(data);
    return result;
}

function resultadosO(data) {
    var vector = data.tablero;
    var cantidad1 = 0;
    var cantidad2 = 0;
    for (var i = 0; i < vector.length; i++) {
        for (var j = 0; j < vector.length; j++) {
            if (vector[i][j] == "O") {
                cantidad1++;
            }
            if (vector[j][i] == "O") {
                cantidad2++;
            }

        }

        if ((cantidad1 === 3) || (cantidad2 === 3)) {
            return true;
        }
        if (((vector[0][0] == "O") && (vector[1][1] == "O") && (vector[2][2] == "O")) || ((vector[0][2] == "O") && (vector[1][1] == "O") && (vector[2][0] == "O"))) {
            return true;
        }

        cantidad1 = 0;
        cantidad2 = 0;

    }

    return false;
}

function estadoTateti(id) {
    let tatetiJSON = JSON.parse(fs.readFileSync('InfoTateti.json', 'utf-8'));
    let posId = tatetiJSON.findIndex(e => e.boardId == id);
    let auxTateti = new Object();
    auxTateti.turno = tatetiJSON[posId].turno;
    auxTateti.idGanador = tatetiJSON[posId].idGanador;
    auxTateti.tablero = tatetiJSON[posId].tablero;
    auxTateti.ganador = tatetiJSON[posId].ganador;
    if (corroborarEmpate(auxTateti.tablero)) {
        auxTateti.ganador = "E";
    }
    return auxTateti;
}

function corroborarEmpate(arr) {
    let bool = true;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == " ") {
                bool = false;
            }
        }
    }
    return bool;
}

function terminar(id) {
    //console.log(id);
    let tatetiJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = tatetiJSON.findIndex(e => e.boardId == id);
    if ((posId != -1) && (posId != tatetiJSON.length)) {
        for (let i = posId; i < tatetiJSON.length - 1; i++) {
            tatetiJSON[i] = tatetiJSON[i + 1];
        }
        tatetiJSON.pop();
        fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
        return true;
    }
    else if (posId != -1) {
        tatetiJSON.pop();
        fs.writeFileSync(url, JSON.stringify(tatetiJSON), 'utf-8');
        return true;

    }
    return true;
}
module.exports = {
    playTateti: tatetiboard,
    playTatetiSecondPLayer: tatetiboardParameter,
    tatetiJuegaFP: tatetiJuegaFP,
    tatetiJuegaSP: tatetiJuegaSP,
    estadoTateti: estadoTateti,
    terminar: terminar
};