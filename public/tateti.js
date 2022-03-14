const dataTable = new Object();
function inicio() {
    if (window.location.href.indexOf('?boardId=') != -1) {
        let searchParams = new URLSearchParams(window.location.search);
        $.ajax({
            method: "GET",
            url: 'tateti/board/' + `${searchParams.get('boardId')}`,
        }).done(function (response) {
            if(response.error==400){
                alert('Ha surgido un problema en el board/id del jugador 2');
            }else{
                dataTable.id = response.id;//id del player uno
                dataTable.bID = response.boardId;
        }
        }).fail(function () {
            alert("Algo salió mal ;(");
        });
    } else {
        $.ajax({
            method: "GET",
            url: `tateti/board`,
        }).done(function (response) {
            if(response.error==400){
                alert('Ha surgido un problema en el board/id del jugador 1');
            }else{
                dataTable.bID = response.boardId;
                dataTable.tablero = response.tablero;
                dataTable.id = response.id;//id del player dos
                let Element = document.querySelector("#inpUrl");
                Element.value = (window.location.href + '?boardId=' + response.boardId);
                let inpCopy = document.createElement('input');
                inpCopy.setAttribute("type", "button");
                inpCopy.setAttribute("value", "Copiar URL");
                inpCopy.setAttribute("onclick", "copyInput()");
                let aNewPage = document.createElement('a');
                aNewPage.setAttribute("href", `${Element.value}`);
                aNewPage.setAttribute("target", "_blank");
                let inpNewPage = document.createElement('input');
                inpNewPage.setAttribute("type", "button");
                inpNewPage.setAttribute("id", "inpNP");
                inpNewPage.setAttribute("value", "Abrir en una ventana nueva");
                aNewPage.appendChild(inpNewPage);
                let divUrl = document.querySelector("#divUrl");
                divUrl.appendChild(inpCopy);
                divUrl.appendChild(aNewPage);
            }
        }).fail(function () {
            alert("Algo salió mal ;(");
        });
    }
    setTimeout(peticionConstante, 500);
}

function enviar(id) {
    dataTable.fila = id[1];
    dataTable.columna = id[2];
    if (window.location.href.indexOf('?boardId=') != -1) {
        $.ajax({
            method: "POST",
            url: `/tateti/${dataTable.bID}/play`,
            data: dataTable
        }).done(function (response) {
            dataTable.ganador = response.data.ganador;
            if ((dataTable.ganador == " ")) {
                dataTable.tablero = response.data.tablero;
                if (response.data.estadoDelJuego == "OCUPADO") {
                    alert("Lugar Ocupado")
                }
                else {
                    if (response.data.estadoDelJuego == "INVALIDO") {
                        alert("No es tu turno es turno de X");
                    } else {
                        pintarPOST(dataTable.fila, dataTable.columna, "O");
                    }
                }
            }
        }).fail(function () {
            alert("Algo salió mal en primer jugador");
        });
    } else {
        $.ajax({
            method: "POST",
            url: `/tateti/play`,
            data: dataTable
        }).done(function (response) {
            dataTable.tablero = response.data.tablero;
            dataTable.ganador = response.data.ganador;
            if ((dataTable.ganador == " ")) {

                if (response.data.estadoDelJuego == "ESPERA") {
                    alert("No puedes jugar todavia, jugador 2 no conectado")
                } else {
                    if (response.data.estadoDelJuego == "OCUPADO") {
                        alert("Lugar Ocupado")
                    }
                    else {
                        if (response.data.estadoDelJuego == "INVALIDO") {
                            alert("No es tu turno es turno de O");
                        } else {
                            pintarPOST(dataTable.fila, dataTable.columna, "X");
                        }
                    }
                }
            }

        }).fail(function () {
            alert("Algo salió mal en primer jugador");
        });
    }
}

//FUNCION QUE PEGA EN EL PORTAPAPELES EL LINK PARA COMPARTIR
function copyInput() {
    let copyInpUrl = document.querySelector("#inpUrl");
    copyInpUrl.select();
    copyInpUrl.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

//FUNCION QUE PIDE CONSTANTEMENTE Y MANDA A PINTAR EL TABLERO
function peticionConstante() {
    $.ajax({
        method: "GET",
        url: `/tateti/board/LecturaTablero/${dataTable.bID}`,
    }).done(function (response) {
        pintarTablero(response.tablero, response.turno);
        if (response.ganador != "E") {
            if (response.ganador == " ") {
                setTimeout(peticionConstante, 50);
            } else {
                if (response.idGanador == dataTable.id ? alert("GANASTE") : alert("PERDISTE"));
                terminarYborrar();
            }
        } else {
            alert('EMPATE!');
            terminarYborrar();
        }
    });
}
function terminarYborrar() {
    $.ajax({
        method: "DELETE",
        url: `/tateti/board/${dataTable.bID}`,
    }).done(function (response) {
        let trn = document.getElementById('trn');
        trn.textContent = "No hay turnos disponibles"
        let tdTodos = document.getElementsByTagName('td');
        let tds = [...tdTodos];
        tds.forEach((td) => td.removeAttribute("onclick"));
        tds.forEach((td) => td.addEventListener('click', yaTermino));
    });
}
function yaTermino() {
    alert('No puedes seguir jugando la partida ya termino!');
}
//FUNCION QUE RECORRE EL TABLERO Y LO MANDA A PINTAR
function pintarTablero(arr, turno) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] != " ") {
                pintar(i, j, arr[i][j], turno);
            }
        }
    }
}

//FUNCION QUE PINTA CUANDO APRETAS EN UNA POSICION
function pintarPOST(fila, columna, ficha) {
    let id = `#p${fila}${columna}`
    let td = document.querySelector(id);
    td.textContent = ficha.toLowerCase();
    let turn = document.querySelector('#trn');
    let turnFicha = "X";
    if (ficha == "X") {
        turnFicha = "O";
    }
    turn.textContent = `Turno: ${turnFicha}`
}

//FUNCION QUE PINTA EL ELEMENTO DEL TABLERO EN PANTALLA
function pintar(fila, columna, ficha, turno) {
    let id = `#p${fila}${columna}`
    let td = document.querySelector(id);
    td.textContent = ficha.toLowerCase();
    let turn = document.querySelector('#trn');
    turn.textContent = `Turno: ${turno}`
}

