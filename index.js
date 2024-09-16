document.addEventListener("DOMContentLoaded", function () {
    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            if (username === "admin" && password === "1234") {
                window.location.href = "cartas.html";
            } else {
                alert("Usuario o contraseña invalida");
            }
        });
    }
    // Limpiar el localStorage al cargar la página
    localStorage.removeItem('datos');

    // Cargar los datos desde data.json
    cargarJSON();

    // Registrar evento de submit para agregar nuevas cartas
    document.querySelector('#registrar').addEventListener('click', function (event) {
        event.preventDefault();
        guardarCarta();
        pintarTabla();
    });

    // Incrementar cantidad cuando se hace clic en una carta
    document.querySelectorAll('.card').forEach(function (card) {
        card.addEventListener('click', function () {
            var datos = JSON.parse(localStorage.getItem('datos')) || [];
            var numeroCarta = this.querySelector('img').getAttribute('src').match(/\d+/)[0]; // Obtener número de la carta de la imagen

            datos.forEach(item => {
                if (item.numero === numeroCarta) {
                    item.cantidad++;
                }
            });

            localStorage.setItem('datos', JSON.stringify(datos));
            pintarTabla();
        });
    });

    // Guardar nueva carta en el localStorage
    function guardarCarta() {
        var numero = document.querySelector('#numeroCard').value;
        var carta = document.querySelector('#typeCard').value;
        var datos = JSON.parse(localStorage.getItem('datos')) || [];

        // Verificar si el número de carta ya existe
        var cartaExistente = datos.find(item => item.numero === numero);
        if (cartaExistente) {
            alert('Esta carta ya está registrada.');
            return;
        }

        // Crear nueva carta y agregarla al array
        var nuevaCarta = { numero: numero, carta: carta, cantidad: '0' };
        datos.push(nuevaCarta);
        localStorage.setItem('datos', JSON.stringify(datos));

        // Agregar la carta al contenedor de cartas en el <main>
        var main = document.querySelector('main');
        var nuevaCartaElement = document.createElement('div');
        nuevaCartaElement.classList.add('card');
        nuevaCartaElement.innerHTML = `<img src="img/${numero}.png" alt="${carta}">`;
        main.appendChild(nuevaCartaElement);

        // Re-registrar evento de clic para la nueva carta
        nuevaCartaElement.addEventListener('click', function () {
            datos.forEach(item => {
                if (item.numero === numero) {
                    item.cantidad++;
                }
            });
            localStorage.setItem('datos', JSON.stringify(datos));
            pintarTabla();
        });
    }

    // Función para cargar datos desde el archivo JSON
    function cargarJSON() {
        fetch('data.json')
            .then(response => response.json())
            .then(datos => {
                localStorage.setItem('datos', JSON.stringify(datos));
                pintarTabla();
            })
            .catch(error => console.error('Error al cargar el JSON:', error));
    }

    // Función para pintar la tabla con los datos del localStorage
    function pintarTabla() {
        var datos = JSON.parse(localStorage.getItem('datos')) || [];
        let res = document.querySelector('tbody');
        res.innerHTML = '';

        // Ordenar las cartas por cantidad (de mayor a menor)
        datos.sort((a, b) => b.cantidad - a.cantidad);

        datos.forEach(item => {
            res.innerHTML += `<tr>
                <td>${item.numero}</td>
                <td>${item.carta}</td>
                <td>${item.cantidad}</td>
            </tr>`;
        });
    }
});