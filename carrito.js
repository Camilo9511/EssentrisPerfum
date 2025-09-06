// 1. Declaración del carrito (vacío o recuperado del localStorage)
const cart = {};

// Función para guardar en localStorage
function guardarCarrito() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para renderizar el carrito (solo en carrito.html)
function actualizarCarrito() {
  const cont = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('cart-empty');
  const totalP = document.getElementById('cart-total');
  cont.innerHTML = '';

  const vacio = Object.keys(cart).length === 0;
  emptyMsg.style.display = vacio ? 'block' : 'none';

  let totalGeneral = 0;

  Object.values(cart).forEach(item => {
    const tr = document.createElement('tr');
    const subtotal = item.precio * item.cantidad;
    totalGeneral += subtotal;

    tr.innerHTML = `
      <td>
        <img class="cart-item-img" src="${item.imagen}" alt="${item.nombre}">
        <p>${item.nombre} (${item.talla})</p>
      </td>
      <td>$${item.precio.toFixed(2)}</td>
      <td>
        <input type="number" class="item-cantidad" value="${item.cantidad}" min="1">
      </td>
      <td class="item-subtotal">$${subtotal.toFixed(2)}</td>
      <td><button class="boton-eliminar"</button>Eliminar</td>
    `;
    //ELIMINAR PRODUCTOS

    const eliminarBtn = tr.querySelector('.boton-eliminar');
    eliminarBtn.addEventListener('click', () => {
      if (confirm(`¿Eliminar ${item.nombre} (${item.talla}) del carrito?`)) {
        delete cart[item.nombre + item.talla];
        guardarCarrito();
        actualizarCarrito();
      }
    });

    const qtyInput = tr.querySelector('.item-cantidad');
    qtyInput.addEventListener('change', () => {
      const q = parseInt(qtyInput.value, 10);
      if (q < 1) return (qtyInput.value = item.cantidad);
      item.cantidad = q;
      guardarCarrito();
      actualizarCarrito();
    });

    cont.appendChild(tr);
  });

  totalP.textContent = `Total: $${totalGeneral.toFixed(2)}`;
}

//CONTADOR CARRITO
function actualizarBadgeCarrito() {
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.cantidad, 0);

  const badge = document.getElementById('cart-count');
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// --- UN SOLO BLOQUE DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
  // 3. Al cargar la página, cargamos carrito en memoria y mostramos si corresponde
  Object.assign(cart, JSON.parse(localStorage.getItem('cart')) || {});
  console.log('Carrito montado al cargar:', cart);

  // Solo actualiza si estamos en carrito.html o pagos.html:
  if (location.pathname.includes('carrito.html')) {
    actualizarCarrito();
  }
  if (location.pathname.includes('pagos.html')) {
    actualizarCarrito();
  }

  // Ejecutar al cargar la página
  actualizarBadgeCarrito();

  // 2. Agregar producto al carrito (se ejecuta en producto.html)
  document.querySelectorAll('.formulario').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nombre = form.closest('main').querySelector('h1').textContent.trim();
      const precio = 20; // ajusta según tu lógica
      const imagen = form.closest('main').querySelector('.camisa_imagen').src;
      const talla = form.querySelector('.talla').value;
      const cantidad = parseInt(form.querySelector('.cantidad').value, 10);

      if (talla=="--Seleccionar talla--") {
        alert('Selecciona una talla');
        return;
      }

      const id = nombre + talla;
      if (!cart[id]) {
        cart[id] = { nombre, precio, imagen, talla, cantidad: 0 };
      }
      cart[id].cantidad += cantidad;
      guardarCarrito();
      actualizarBadgeCarrito();
      console.log('Producto guardado en localStorage:', JSON.parse(localStorage.getItem('cart')));
      alert("se agregò el producto al carrito")
    });
  });


  

  //RESUMEN DE COMPRA
  const formCompra = document.querySelector('.formulario-compra');
  if (formCompra) {
    formCompra.addEventListener('submit', function(e) {
      e.preventDefault();

      const campos = this.querySelectorAll('input, select');
      let faltantes = [];

      campos.forEach(c => {
        if (c.tagName === 'INPUT' && c.value.trim() === '') {
          faltantes.push(c.placeholder || c.className);
        }
        if (c.tagName === 'SELECT' && (!c.value || c.selectedIndex === 0)) {
          faltantes.push('medio de pago');
        }
      });

      if (faltantes.length > 0) {
        alert('Por favor completa: ' + [...new Set(faltantes)].join(', '));
      } else {
        alert('Formulario completo ✅');
      }
    });
  }

  // --- Carrusel de imágenes ---
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 3000);
  }
});

//Cambio modo oscuro
/* function modoOscuro() {
  let body = document.getElementById("body");
  body.classList.toggle("modo-oscuro");

  let modo = document.getElementById("modo");
  modo.textContent = body.classList.contains("modo-oscuro") ? "🌞" : "🌙";

  let producto = document.getElementById("producto");
  if (producto) {
    producto.classList.toggle("modo-blanco");
  }

  let nosotros = document.getElementById("nosotrosColor");
  if (nosotros) {
    nosotros.classList.toggle("modo-blanco");
  }

  let textoNosotros = document.getElementsByClassName("texto_nosotros")[0];
  if (textoNosotros) {
    textoNosotros.classList.toggle("texto-blanco");
  }

  let tituloNosotros = document.getElementsByClassName("titulo_nosotros")[0];
  if (tituloNosotros) {
    tituloNosotros.classList.toggle("texto-blanco");
  }

  let textoInformacion = document.getElementsByClassName("texto__informacion");
  [...textoInformacion].forEach(texto => {
    texto.classList.toggle("texto-blanco");
  });

  let nombresProductos = document.querySelectorAll(".producto__nombre");
  nombresProductos.forEach(nombre => {
    nombre.classList.toggle("texto-blanco");
  });

  let precioProductos = document.querySelectorAll(".producto__precio");
  precioProductos.forEach(nombre => {
    nombre.classList.toggle("texto-blanco");
  })

  let carrito = document.querySelectorAll(".cart-table");
   carrito.forEach(carrito => {
    carrito.classList.toggle("texto-blanco");
  })

} */
function seleccionProducto() {
  let productoSeleccionado = document.getElementById("productoNombre").textContent;
  
  // Guardar en localStorage
  localStorage.setItem("productoSeleccionado", productoSeleccionado);

  // Redirigir a la otra página
  window.location.href = "productos.html";
}

//link wapp

function enviarWhatsApp() {
  let cartItems = document.querySelectorAll("#cart-items tr");
  if (cartItems.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "🛒 *Nuevo pedido:*\n\n";
  cartItems.forEach(item => {
    let producto = item.querySelector("td:nth-child(1)").innerText;
    let precio = item.querySelector("td:nth-child(2)").innerText;
    let cantidad = item.querySelector("td:nth-child(3)").innerText;
    let subtotal = item.querySelector("td:nth-child(4)").innerText;
    mensaje += `• ${producto} | ${cantidad} x ${precio} = ${subtotal}\n`;
  });

  let total = document.getElementById("cart-total").innerText;
  mensaje += `\n💰 ${total}`;

  let numero = "573132760571"; // Reemplaza con tu número de WhatsApp
  let url;

  // Detectar si es móvil o escritorio
  if (/Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) {
    // Móvil → abre app de WhatsApp
    url = `https://api.whatsapp.com/send?phone=${3132760571}&text=${encodeURIComponent(mensaje)}`;
  } else {
    // PC → abre WhatsApp Web
    url = `https://web.whatsapp.com/send?phone=${3132760571}&text=${encodeURIComponent(mensaje)}`;
  }

  window.open(url, "_blank");
}
  

  


   
  

 
  





//ONLOAD

/* function entrar(){
  
  
  alert("Bienvenido")
} */