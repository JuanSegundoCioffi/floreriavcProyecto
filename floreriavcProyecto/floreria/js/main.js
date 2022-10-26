const url = "./data/data.json";
const info = JSON.parse(localStorage.getItem("CARRITO")) || [];
let carrito = new Carrito(info);
const contenedorProductos = document.querySelector(".productos-container");
const contador = document.querySelector(".contador-carrito");
const productosCarrito = document.querySelector(".carrito__productosCarrito");
const botonFinalizar = document.querySelector("#boton-finalizar");
const volverAlInicio = document.querySelector('.volver');

const mostrarProductos = () => {
  fetch(url)
    .then((res) => res.json())
    .then((productos) => {
      productos.forEach((producto) => {
        const infoProducto = document.createElement("div");
        infoProducto.classList.add("productos-contenido");
        infoProducto.innerHTML = `
            <img src='${producto.image}' alt='productos-img'>
            <h3 class='productos-nombre'>${producto.category}</h3>
            <span class='productos-detalles'>${producto.title}</span>
            <span class='productos-precio'>$${producto.price}</span>
            <button id='agregar${producto.id}' class='button productos-button'><i class="bx bx-cart-alt"></i></button>
        `;
        contenedorProductos.append(infoProducto);

        const botonAgregar = document.querySelector(`#agregar${producto.id}`);
        botonAgregar.addEventListener("click", () => {
          agregarProducto(producto.id);
        });
      });
    });
};

const agregarProducto = (prodId) => {
  fetch(url)
    .then((res) => res.json())
    .then((productos) => {
      let esta = info.some((prod) => prod.id === prodId);
      if (esta) {
        info.map((prod) => {
          prod.id === prodId && prod.quantity++;
        });
      } else {
        let item = productos.find((prod) => prod.id === prodId);
        carrito.agregarAlCarrito(item);
      }
      carrito.guardar();
      actualizarCarrito();
    });
};

const mostrarProductosCarrito = () => {
  productosCarrito.innerHTML = "";
  funcionalidadBotonFinalizar();
  carrito.productos.forEach((prodCarrito) => {
    const infoProductoCarrito = document.createElement("div");
    infoProductoCarrito.classList.add(
      "carrito__productosCarrito-infoProductoCarrito"
    );
    infoProductoCarrito.innerHTML = `
    <div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
      <div class="col-md-4">
      <img src="../${prodCarrito.image}" class="img-fluid rounded-start" alt="${prodCarrito.title}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${prodCarrito.title}</h5>
          <p class="card-text">Precio: $${prodCarrito.price}</p>
          <p class="card-text">Cantidad: ${prodCarrito.quantity}</p>
          <button class="btn btn-warning" id='eliminar${prodCarrito.id}'>Eliminar</button>
        </div>
        </div>
      </div>
    </div>
    `;
    productosCarrito.append(infoProductoCarrito);

    const botonEliminar = document.querySelector(`#eliminar${prodCarrito.id}`);
    botonEliminar.addEventListener("click", () => {
      eliminarProducto(prodCarrito.id);
    });
  });
  if (carrito.productos.length > 0) {
    let precioTotal = carrito.productos.reduce(
      (acc, p) => acc + p.quantity * p.price,
      0
    );
    const pPrecioTotal = document.createElement("b");
    pPrecioTotal.textContent = `Precio total: $${precioTotal.toFixed(2)}`;
    productosCarrito.append(pPrecioTotal);
  }
};

const eliminarProducto = (prodId) => {
  let item = carrito.productos.find((prod) => prod.id === prodId);
  let indice = carrito.productos.indexOf(item);
  item.quantity > 1 ? item.quantity-- : carrito.productos.splice(indice, 1);
  carrito.guardar();
  actualizarCarrito();
  mostrarProductosCarrito();
};

const funcionalidadBotonFinalizar = () => {
  if (carrito.productos.length < 1) {
    botonFinalizar.setAttribute("style", "display:none");
    productosCarrito.innerHTML = "<h3>El carrito está vacío</h3>";
  }
  botonFinalizar.addEventListener("click", () => {
    Swal.fire({
      title: '¿Estás seguro que deseas finalizar la compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Seguir comprando'
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          volverAlInicio.click();
        }, 1000);
        Swal.fire({
          title: 'Muchas gracias por elegirnos, su compra fue finalizada!',
          icon: 'success'
        })
        carrito.vaciar();
        carrito.guardar();
        mostrarProductosCarrito();
        actualizarCarrito();
      }
    });
  });
};

const actualizarCarrito = () => {
  let cantidadTotal = carrito.productos.reduce((acc, p) => acc + p.quantity, 0);
  cantidadTotal === 0
    ? (contador.textContent = "")
    : (contador.textContent = `${cantidadTotal}`);
};

const main = () => {
  actualizarCarrito();
  mostrarProductos();
  mostrarProductosCarrito();
};

main();
