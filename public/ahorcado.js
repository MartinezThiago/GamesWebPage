var dataObject = new Object();
function inicio() {
    //SETEA TODO EN BLANCO POR DEFAULT
    const div = document.querySelector("#descripcion");
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    $('#palabra').val("");

    $('#letra').val("");
    // FIN DE SETEA TODO EN BLANCO POR DEFAULT
    $.ajax({
        method: "GET",
        url: `/ahorcado`,
    }).done(function (response) {
        if(response.data.error==400){
            alert("ERROR!! el id o la palabra no son validos!")
            $.ajax({
                method: "POST",
                url: "/ahorcado/terminar",
                data: response.data.id //le manda en un json , la word que obtiene del input
            }).done(function (response) {
                if(response) {
                    inicio();
                }
            });
        }
        else{
            alert("Hola, soy MyRobot te generé una palabra aleatoria,a ver si me podes ganar, let´s play :)");
            const div = document.querySelector("#descripcion");
            let liProgreso = document.createElement('li');
            let img = document.createElement('img');
            img.src = "img/6vidas.png"
            let splited = response.data.progresoPalabra.split("");
            liProgreso.textContent = splited.join(" ");
            let imgCorazones = document.createElement('img');
            imgCorazones.src = "img/hearts/corazon_6_vidas.png"
            imgCorazones.setAttribute("id", "imgHearts");
            div.appendChild(imgCorazones);
            div.appendChild(img);
            div.appendChild(liProgreso);
            dataObject.id = response.data.id;
        }
    }).fail(function () {
        alert("Algo salió mal ;(");//NO ENCONTRO EL ARCHIVO palabraRandom.json
    });
    $('#letra').focus();

}


$('#enviar').on('click', function () {
    let word = $('#letra').val();
    $('#letra').focus();
    if (validacionLetra(word)) {
        dataObject.letra = word;
        $.ajax({
            method: "POST",
            url: `/ahorcado/jugar`,
            data: dataObject//le manda en un json , la word que obtiene del input
        }).done(function (response) {
            if (response.data == 400) {
                alert("error 400");
            }
            else {
                $('#letra').val("");
                $.ajax({
                    method: "POST",
                    url: "/ahorcado/ganaste",
                    data: dataObject //le manda en un json , la word que obtiene del input
                }).done(function (ganaste) {
                    if (!ganaste.data) {
                        const div = document.querySelector("#descripcion");
                        while (div.hasChildNodes()) {
                            div.removeChild(div.lastChild);
                        }
                        let img = document.createElement('img');
                        let liProgreso = document.createElement('li');
                        let splited = response.data.progresoPalabra.split("");
                        img.src = switchAhorcado(response.data.vidas);
                        liProgreso.textContent = splited.join(" ");
                        let imgCorazones = document.createElement('img');
                        imgCorazones.src = srcImgHearts(response.data.vidas);
                        imgCorazones.setAttribute("id", "imgHearts");
                        div.appendChild(imgCorazones);
                        div.appendChild(img);
                        div.appendChild(liProgreso);
                        if (response.data.vidas === 0) {
                            imgCorazones.src = "img/hearts/corazon_0_vidas.png";
                            div.appendChild(imgCorazones);
                            alert('PERDISTE, iniciando nueva partida, espere un momento');
                            inicio();
                        }
                    } else {
                        const div = document.querySelector("#descripcion");
                        let liProgreso = document.createElement('li');
                        let splited = response.data.progresoPalabra.split("");
                        liProgreso.textContent = "La palabra era " + splited.join(" ");
                        div.appendChild(liProgreso);
                        alert('SOS EL GANADOR, iniciando nueva partida, espere un momento');
                        setTimeout(function () { inicio() }, 3000);
                    }
                });

            }
        }).fail(function () {
            alert("Algo salió mal");

        });
    }
    else {
        alert("Letra Invalida");
        $('#letra').val("");
    }
});

$('#enviar2').on('click', function () {
    let word = $('#palabra').val();
    const div = document.querySelector("#descripcion");
    dataObject.palabra = word;
    if (word === "") {
        alert("No ingreso palabra");
    }
    else {
        $.ajax({
            method: "POST",
            url: "/ahorcado/arriesga",
            data: dataObject //le manda en un json , la word que obtiene del input
        }).done(function (response) {
            if (response.data == null) {
                alert("Lo que ingresate no es un dato valido");
            }
            else {
                if (response.data.progresoPalabra == "GANASTE") {
                    alert("Te la jugaste y te salio bien , felicitaciones, GANASTE, iniciando nueva partida, espere un momento")
                    inicio();
                    while (div.hasChildNodes()) {
                        div.removeChild(div.lastChild);
                    }
                }
                else {
                    alert("Suerte la proxima, iniciando nueva partida, espere un momento");
                    inicio();
                }
            }
        });
    }
});


function srcImgHearts(lifes) {
    let src;
    switch (lifes) {
        case 6:
            src = "img/hearts/corazon_6_vidas.png"
            break;
        case 5:
            src = "img/hearts/corazon_5_vidas.png"
            break;
        case 4:
            src = "img/hearts/corazon_4_vidas.png"
            break;
        case 3:
            src = "img/hearts/corazon_3_vidas.png"
            break;
        case 2:
            src = "img/hearts/corazon_2_vidas.png"
            break;
        case 1:
            src = "img/hearts/corazon_1_vidas.png"
            break;
        case 0:
            src = "img/hearts/corazon_0_vidas.png"
            break;

    }
    return src;
}
function switchAhorcado(data) {
    let src;
    switch (data) {
        case 6:
            src = "img/6vidas.png"
            break;
        case 5:
            src = "img/5vidas.png"
            break;
        case 4:
            src = "img/4vidas.png"
            break;
        case 3:
            src = "img/3vidas.png"
            break;
        case 2:
            src = "img/2vidas.png"
            break;
        case 1:
            src = "img/1vidas.png"
            break;
        case 0:
            src = "img/0vidas.png"
            break;

    }
    return src;
}
function validacionLetra(letra) {
    //SE FIJA SI ES UNA LETRA VALIDA
    // El pattern que vamos a comprobar
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g;//expresion regular que se fija si es una letra del abecedario en MAYUS o MINUS
    return (pattern.test(letra));//El método test() ejecuta la búsqueda de una ocurrencia entre una expresión regular y una cadena especificada. Devuelve true o false.
}
