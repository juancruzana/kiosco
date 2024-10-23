function toggleAgregarProducto() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = formContainer.style.display === 'none' || formContainer.style.display === '' ? 'block' : 'none';
}

// Función para agregar un producto
function agregarProducto() {
    const producto = document.getElementById('producto').value;
    const categoria = document.getElementById('categoria').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const reabastecer = document.getElementById('reabastecer').value;

    if (producto === "" || categoria === "" || cantidad === "" || precio === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Hacer una solicitud POST a la API
    fetch('/agregar_producto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: producto,
            categoria: categoria,
            cantidad: cantidad,
            precio: precio,
            reabastecer: reabastecer
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // alert(data.message);
        // Aquí puedes agregar la lógica para actualizar la tabla
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al agregar el producto: ' + error.message);
    });

    // Limpiar los campos del formulario
    document.getElementById('producto').value = "";
    document.getElementById('categoria').value = "";
    document.getElementById('cantidad').value = "";
    document.getElementById('precio').value = "";
    document.getElementById('reabastecer').value = "No";

    toggleAgregarProducto(); // Ocultar el formulario
}

async function cargarProductos(filtro = '') {
    const response = await fetch('/productos?filtro=' + filtro);
    const productos = await response.json();
    const tabla = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';

    productos.forEach(producto => {
        const nuevaFila = tabla.insertRow();
        const idCelda = nuevaFila.insertCell(0);
        const productoCelda = nuevaFila.insertCell(1);
        const categoriaCelda = nuevaFila.insertCell(2);
        const cantidadCelda = nuevaFila.insertCell(3);
        const precioCelda = nuevaFila.insertCell(4);
        const reabastecerCelda = nuevaFila.insertCell(5);
        const eliminarCelda = nuevaFila.insertCell(6);

        idCelda.innerHTML = producto[0];
        productoCelda.innerHTML = producto[1];
        categoriaCelda.innerHTML = producto[2];
        cantidadCelda.innerHTML = producto[3];
        precioCelda.innerHTML = `$${producto[4]}`;
        reabastecerCelda.innerHTML = producto[5];
        eliminarCelda.innerHTML = `<button onclick="eliminarProducto(this, ${producto[0]})">Eliminar</button>`;
    });
}

function eliminarProducto(boton, idProducto) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        fetch(`/eliminar_producto/${idProducto}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes eliminar la fila de la tabla o volver a cargar los productos
            const fila = boton.parentElement.parentElement;
            fila.remove();  // Eliminar la fila de la tabla
            // O puedes recargar la tabla completa
            // cargarProductos();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al eliminar el producto: ' + error.message);
        });
    }
}

// Eliminar producto sin tener que comfirmar
// function eliminarProducto(boton, idProducto) {
//     fetch(`/eliminar_producto/${idProducto}`, {
//         method: 'DELETE',
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error en la solicitud: ' + response.status);
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Aquí puedes eliminar la fila de la tabla o volver a cargar los productos
//         const fila = boton.parentElement.parentElement;
//         fila.remove();  // Eliminar la fila de la tabla
//         // O puedes recargar la tabla completa
//         // cargarProductos();
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Hubo un problema al eliminar el producto: ' + error.message);
//     });
// }



function buscarProducto() {
    const filtro = document.getElementById('buscarProducto').value;
    cargarProductos(filtro);
}

window.onload = () => cargarProductos();