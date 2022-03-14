'use strict';
const fs = require('file-system');
const crypto = require('crypto');
const url = "InfoAhorcado.json";
const palabraAleatoriaFile = "palabraRandom.json";

function empezar() {

    //INICIO POR DEFAULT LOS VALORES DEL AHORCADO
    //GENERO ID DE LA PARTIDA ALEATORIA

    const id = crypto.randomBytes(16).toString('hex');

    //FIN DE ID DE LA PARTIDA ALEATORIA

    //***objeto que subo en el json del ahorcado*/
    var ahorcado = new Object();
    ahorcado.vidas = 6;
    ahorcado.palabra = "";
    ahorcado.letrasAdivinadas = [];
    ahorcado.idDeLaPartida = id;
    ahorcado.progresoPalabra = "";
    //*** fin objeto que subo en el json del ahorcado*/

    //Objeto que devuelvo
    var ahorcadoQueDevuelvo = new Object();
    ahorcadoQueDevuelvo.id = id;
    ahorcadoQueDevuelvo.error = "";
    //fin objeto que devuelvo

    //***estrutuctura del json */

    var data = JSON.parse(fs.readFileSync(url, 'utf-8'));
    data.push(ahorcado);
    var ahorcado_json = JSON.stringify(data);//JSON.stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON
    fs.writeFileSync(url, ahorcado_json, 'utf-8');//escribimos en disco
    //***fin de estrutuctura del json */
    //TERMINA EL INICIO POR DEFAULT LOS VALORES DEL AHORCADO

    //SACO PALABRA RANDOM
    if (fs.existsSync(palabraAleatoriaFile)) {// verifica si el archivo existe en la ruta dada
        var data = JSON.parse(fs.readFileSync(palabraAleatoriaFile, 'utf-8'));
        let numeroRandom = Math.floor(Math.random() * (data[0].palabraRandom.length));
        var palabra = data[0].palabraRandom[numeroRandom];
        if ((palabra) && (id)) {
            var ahorcadoJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));//leemos de disco el ahorcado
            let posId = ahorcadoJSON.findIndex(e => e.idDeLaPartida == id);
            ahorcadoJSON[posId].palabra = palabra;
            let guionesBajos = "";
            for (let j = 0; j < palabra.length; j++) {
                guionesBajos = guionesBajos + "_";
            }
            ahorcadoJSON[posId].progresoPalabra = guionesBajos;
            ahorcadoQueDevuelvo.progresoPalabra = guionesBajos;
            fs.writeFileSync(url, JSON.stringify(ahorcadoJSON), 'utf-8');//escribimos en disco la modificamcion del ahorcado
            return (ahorcadoQueDevuelvo);
        }
        else {
            ahorcadoQueDevuelvo.error = 400;
            return (ahorcadoQueDevuelvo)//actualizado
        }
    }
    else {
        return undefined;
    }

    //TERMINO PALABRA RANDOM
}

function validacionLetra(letra) {
    //SE FIJA SI ES UNA LETRA VALIDA
    // El pattern que vamos a comprobar
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g;//expresion regular que se fija si es una letra del abecedario en MAYUS o MINUS
    return (pattern.test(letra));//El método test() ejecuta la búsqueda de una ocurrencia entre una expresión regular y una cadena especificada. Devuelve true o false.
}


function validacionGanador(data) {
    let ahorcadoJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = ahorcadoJSON.findIndex(e => e.idDeLaPartida == data.id);
    if (ahorcadoJSON[posId].vidas == 0) {
        terminar(data.id)
    }
    if (ahorcadoJSON[posId].palabra === ahorcadoJSON[posId].progresoPalabra) {
        terminar(data.id);
        return true;
    } else {
        return false
    }
}

function terminar(id) {
    let ahorcadoJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = ahorcadoJSON.findIndex(e => e.idDeLaPartida == id);
    if (posId != ahorcadoJSON.length) {
        for (let i = posId; i < ahorcadoJSON.length - 1; i++) {
            ahorcadoJSON[i] = ahorcadoJSON[i + 1];
        }
    }
    ahorcadoJSON.pop();
    fs.writeFileSync(url, JSON.stringify(ahorcadoJSON), 'utf-8')
}

function siPertenece(palabra, letra) {
    //palabra: es la palabra la cual esta en infoAhorcado
    //letra: letra que ingreso el usuario
    var vector = palabra.split("");
    var encontro = vector.find((element) => element == letra)//se fija en vector si la letra que inserto esta dentro
    if (encontro) {
        return true;
    }
    else {
        return false;
    }
}

function perteneceALaPalabra(letra, id) {
    var ahorcado = new Object();
    var ahorcadoJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = ahorcadoJSON.findIndex(e => e.idDeLaPartida == id);
    let pal = ahorcadoJSON[posId].palabra;
    ahorcado.vidas = ahorcadoJSON[posId].vidas;
    ahorcado.progresoPalabra = ahorcadoJSON[posId].progresoPalabra;
    var letras_adivinadas = ahorcadoJSON[posId].letrasAdivinadas;//vector de letras adivinadas
    var letraMayus = letra.toUpperCase();//letra escrita por el usuario y validada
    if (siPertenece(pal, letraMayus)) {//si devuelve true la letra ingresada pertenece a la palabra
        var arr = pal.split("");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === letraMayus) {
                let aux = ahorcado.progresoPalabra.split("");
                aux[i] = letraMayus;
                ahorcado.progresoPalabra = aux.join("");
                let repetida = letras_adivinadas.find((element) => element == letraMayus);
                if (repetida === undefined) {
                    letras_adivinadas.push(letraMayus);
                }
            }
        }
    }
    else {
        ahorcado.vidas = ahorcadoJSON[posId].vidas - 1;
        ahorcadoJSON[posId].vidas = ahorcadoJSON[posId].vidas - 1;
    }
    ahorcadoJSON[posId].letrasAdivinadas = letras_adivinadas;
    ahorcadoJSON[posId].progresoPalabra = ahorcado.progresoPalabra;

    fs.writeFileSync(url, JSON.stringify(ahorcadoJSON), 'utf-8');//escribimos en disco la modificamcion del ahorcado

    return ahorcado;
}


function duranteElJuego(data) {
    if (validacionLetra(data.letra)) {
        var ahorcado = perteneceALaPalabra(data.letra, data.id);
        if (ahorcado != null) {
            return ({ data: ahorcado })
        }
        else {
            return ({ data: 400 })
        }
    }
    else {
        return ({ data: 400 })
    }

}


function arriesga(response) {
    var ahorcado = new Object();
    var ahorcadoJSON = JSON.parse(fs.readFileSync(url, 'utf-8'));
    let posId = ahorcadoJSON.findIndex(e => e.idDeLaPartida == response.id);
    ahorcado.vidas = ahorcadoJSON[posId].vidas;
    let pal = response.palabra.toUpperCase();
    if (ahorcadoJSON[posId].palabra == pal) {
        ahorcado.progresoPalabra = "GANASTE";
        terminar(response.id);
    }
    else {
        ahorcado.progresoPalabra = "PERDISTE";
        terminar(response.id);
    }
    return ({ data: ahorcado });
}

module.exports = {
    playAhorcado: empezar,
    duranteElJuego: duranteElJuego,
    arriesga: arriesga,
    validacionGanador: validacionGanador,
    terminar: terminar
};