let json;
let discount;
let apiUrl = "http://localhost:3000";

window.onload = async function () {
  // Mostrar el loader
  const loader = document.getElementById("loader_container");
  loader.style.display = "block";

  try {
    const response = await fetch("https://fakestoreapi.com/products");
    json = await response.json();

    const discounts = await fetch(apiUrl + "/getDiscount");
    discount = await discounts.json();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Traducir los datos cargados
    const translatedData = await translateJSON(json);

    // Reemplazar el contenido del JSON original con los datos traducidos
    json = translatedData;

    // Crear los elementos necesarios en la página
    callNeededFunctions(cart);
  } catch (error) {
    console.error("Error de carga:", error);
  } finally {
    // Ocultar el loader cuando todas las promesas se hayan cumplido
    loader.style.display = "none";
  }
};

function callNeededFunctions(cart) {
  suscribeListener();
  refreshCart();
  theme();
  fetchAndFillOrders();
}

function theme() {
  const themeToggle = document.getElementById("theme-toggle");

  const startTheme = "dark-theme";

  // Elementos del archivo styles.css
  const body = document.body;
  const scrollbarsTrack = document.querySelectorAll(
    "::-webkit-scrollbar-track"
  );
  const scrollbarsThumb = document.querySelectorAll(
    "::-webkit-scrollbar-thumb"
  );
  const sectionh2 = document.querySelectorAll("section h2");
  const header = document.querySelector("header");

  // Elementos del archivo navbar.css
  const nav = document.querySelector("nav");
  const navUlLiA = document.querySelectorAll("nav ul li a");
  const searchBar = document.querySelector(".search-bar");
  const searchBarInput = document.querySelector(".search-bar input");
  const searchBarI = document.querySelector(".search-bar i");
  const cart = document.querySelector(".cart");
  const cartSpan = document.querySelector(".cart span");

  // Elementos del archivo hero.css

  // Elementos del archivo footer.css
  const footer = document.querySelector("footer");
  const footerForm = document.querySelector("#footer-form");
  const footerFormInput = document.querySelector("#footer-form input");
  const footerFormButton = document.querySelector("#footer-form button");
  const iconos = document.querySelectorAll(".redes-footer a i");

  // elementos del archivo cart.html
  const buyoutTitle = document.querySelector(".title-cart");
  const tableCart = document.querySelector(".table-cart");
  const btnContinue = document.querySelector(".btn-continue");

  const adminA = document.querySelectorAll(".admin a");

  // Agregar la clase dark-theme al inicio
  body.classList.add(startTheme);
  scrollbarsTrack.forEach((track) => track.classList.add(startTheme));
  scrollbarsThumb.forEach((thumb) => thumb.classList.add(startTheme));
  sectionh2.forEach((h2) => h2.classList.add(startTheme));
  header.classList.add(startTheme);
  nav.classList.add(startTheme);
  navUlLiA.forEach((a) => a.classList.add(startTheme));
  searchBar.classList.add(startTheme);
  searchBarInput.classList.add(startTheme);
  searchBarI.classList.add(startTheme);
  cart.classList.add(startTheme);
  cartSpan.classList.add(startTheme);
  footer.classList.add(startTheme);
  footerForm.classList.add(startTheme);
  footerFormInput.classList.add(startTheme);
  footerFormButton.classList.add(startTheme);
  iconos.forEach((i) => i.classList.add(startTheme));
  buyoutTitle.classList.add(startTheme);
  tableCart.classList.add(startTheme);
  btnContinue.classList.add(startTheme);
  adminA.forEach((i) => i.classList.add(startTheme));

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    scrollbarsTrack.forEach((track) => track.classList.toggle("light-theme"));
    scrollbarsThumb.forEach((thumb) => thumb.classList.toggle("light-theme"));
    sectionh2.forEach((h2) => h2.classList.toggle("light-theme"));
    header.classList.toggle("light-theme");
    nav.classList.toggle("light-theme");
    navUlLiA.forEach((a) => a.classList.toggle("light-theme"));
    searchBar.classList.toggle("light-theme");
    searchBarInput.classList.toggle("light-theme");
    searchBarI.classList.toggle("light-theme");
    cart.classList.toggle("light-theme");
    cartSpan.classList.toggle("light-theme");
    footer.classList.toggle("light-theme");
    footerForm.classList.toggle("light-theme");
    footerFormInput.classList.toggle("light-theme");
    footerFormButton.classList.toggle("light-theme");
    iconos.forEach((i) => i.classList.toggle("light-theme"));
    buyoutTitle.classList.toggle("light-theme");
    tableCart.classList.toggle("light-theme");
    btnContinue.classList.toggle("light-theme");
    adminA.forEach((i) => i.classList.add("light-theme"));

    // Guardar el tema en localStorage
    const theme = body.classList.contains("light-theme")
      ? "light-theme"
      : "dark-theme";

    localStorage.setItem("theme", theme);
  });

  const themeStored = localStorage.getItem("theme");

  if (!themeStored) {
    localStorage.setItem("theme", startTheme);
  }

  if (themeStored === "light-theme") {
    themeToggle.click();
  }
}

async function translateJSON(json) {
  try {
    const translatePromises = json.map(async (product) => {
      const titlePromise = translateText(product.title);
      const descriptionPromise = translateText(product.description);
      const categoryPromise = translateText(product.category);

      const [title, description, category] = await Promise.all([
        titlePromise,
        descriptionPromise,
        categoryPromise,
      ]);

      return {
        ...product,
        title,
        description,
        category,
      };
    });

    return Promise.all(translatePromises);
  } catch (error) {
    throw new Error("Error de traducción en translateJSON: " + error.message);
  }
}

async function translateText(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(`${apiUrl}/translate?text=${encodedText}`);
    const data = await response.json();
    if (data && data.translatedText) {
      return data.translatedText;
    } else {
      throw new Error("Error de traducción");
    }
  } catch (error) {
    throw new Error("Error de traducción en translateText: " + error.message);
  }
}

function suscribeListener() {
  const suscribeButton = document.getElementById("suscribe-button");
  suscribeButton.addEventListener("click", (e) => {
    e.preventDefault();
    suscribeEmail();
  });
}

async function suscribeEmail() {
  const emailInput = document.getElementById("suscribe-email");

  const response = await fetch(apiUrl + "/suscribe?email=" + emailInput.value);
  const responseData = await response.json();

  if (responseData.error) {
    showToast(responseData.error, "error");
  } else {
    showToast(responseData.message, "info");
  }
}

function refreshCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const count = cart.reduce((total, item) => total + item[1], 0);
  document.getElementById("cart-count").innerHTML = count;
}

// Función para obtener las órdenes del servidor y llenar la tabla
async function fetchAndFillOrders() {
  try {
    const response = await fetch(apiUrl + "/orders"); // Endpoint para obtener las órdenes
    if (!response.ok) {
      throw new Error("Error al obtener las órdenes");
    }
    const orders = await response.json();
    fillTable(orders); // Llamar a la función para llenar la tabla con las órdenes
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para llenar la tabla con las órdenes
function fillTable(orders) {
  const tableHead = document.querySelector(".table-head-order");
  const cartFill = document.getElementById("order-fill");

  // Agregar estilo grid-template-columns a table-head y cart-fill
  tableHead.style.gridTemplateColumns = "1fr 1fr 4fr 1fr 1fr";

  tableHead.innerHTML = `
    <div>Order ID</div>
    <div>Item ID</div>
    <div>Nombre</div>
    <div>Precio</div>
    <div>Cantidad</div>
  `;

  // Llenar las filas de la tabla con los items de las órdenes
  orders.forEach((order, index) => {
    const row = document.createElement("div");
    row.classList.add("card-order");
    const shortName =
      order.name.length > 20 ? order.name.substring(0, 20) + "..." : order.name;
    // if order.id=-100 then "Envio"
    row.innerHTML = `
        <div>${order.order_id}</div>
        <div>${order.id == -100 ? "Envio" : order.id}</div>
        <div>${shortName}</div>
        <div>$ ${order.price}</div>
        <div>${order.quantity}</div>
      `;
    row.style.gridTemplateColumns = "1fr 1fr 4fr 1fr 1fr";
    cartFill.appendChild(row);

    // Verificar si estamos en el último elemento
    if (index !== orders.length - 1) {
      const line = document.createElement("hr");
      cartFill.appendChild(line);
    }
  });
}
