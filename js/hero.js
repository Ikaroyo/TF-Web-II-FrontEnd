window.onload = async function () {
  // Mostrar el loader
  const loader = document.getElementById("loader_container");
  loader.style.display = "block";

  try {
    // Cargar los datos desde la API
    const response = await fetch("https://fakestoreapi.com/products");
    const discountsResponse = await fetch("https://tf-web-ii-backend.onrender.com/getDiscount");

    // Guardar los datos cargados en el objeto json
    json = await response.json();
    discount = await discountsResponse.json();

    // Traducir los datos cargados
    const translatedData = await translateJSON(json);

    // Reemplazar el contenido del JSON original con los datos traducidos
    json = translatedData;

    // Crear los elementos necesarios en la página
    createNeededElements();
  } catch (error) {
    console.error("Error de carga:", error);
  } finally {
    // Ocultar el loader cuando todas las promesas se hayan cumplido
    loader.style.display = "none";
  }
};

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
    const response = await fetch(
      `http://localhost:3000/translate?text=${encodedText}`
    );
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

function createNeededElements() {
  createHero(json, discount);
  addListenersToCards();
  fillCatalog(json, discount);
  refreshCart();
  addSearchListener();
  fixButtons();
  suscribeListener();
  addListenersToCatalogCards();
  theme();
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
  const navA = document.querySelectorAll("nav-a");

  // Elementos del archivo hero.css
  const bigCard = document.querySelector(".big-card");
  const cardDown = document.querySelector(".card-down");
  const cardUp = document.querySelector(".card-up");
  const hero = document.querySelector(".hero");
  const priceCatalogCardHero = document.querySelectorAll(
    ".price-catalog-card-hero"
  );

  // Elementos del archivo footer.css
  const footer = document.querySelector("footer");
  const footerForm = document.querySelector("#footer-form");
  const footerFormInput = document.querySelector("#footer-form input");
  const footerFormButton = document.querySelector("#footer-form button");
  const iconos = document.querySelectorAll(".redes-footer a i");

  // Elemetnos de catalog.css

  const catalog = document.querySelector(".catalog");
  const cardCatalog = document.querySelectorAll(".card-catalog");
  const cardCatalogHover = document.querySelectorAll(".card-catalog:hover");

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
  catalog.classList.add(startTheme);
  cardCatalog.forEach((card) => card.classList.add(startTheme));
  cardCatalogHover.forEach((card) => card.classList.add(startTheme));
  navA.forEach((a) => a.classList.add(startTheme));
  bigCard.classList.add(startTheme);
  cardDown.classList.add(startTheme);
  cardUp.classList.add(startTheme);
  hero.classList.add(startTheme);

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

    catalog.classList.toggle("light-theme");
    cardCatalog.forEach((card) => card.classList.toggle("light-theme"));
    cardCatalogHover.forEach((card) => card.classList.toggle("light-theme"));
    navA.forEach((a) => a.classList.toggle("light-theme"));

    bigCard.classList.toggle("light-theme");
    cardDown.classList.toggle("light-theme");
    cardUp.classList.toggle("light-theme");
    hero.classList.toggle("light-theme");

    priceCatalogCardHero.forEach((card) =>
      card.classList.toggle("light-theme")
    );

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

function addSearchListener() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const searchValue = removeDiacritics(e.target.value);
    const cards = document.querySelectorAll(".card-catalog");
    // go to section #catalog

    const section = document.getElementById("catalog");

    section.scrollIntoView({ behavior: "smooth" });
    cards.forEach((card) => {
      const title = removeDiacritics(card.querySelector("h3").textContent);
      if (title.toLowerCase().includes(searchValue.toLowerCase())) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// Función para eliminar tildes y diacríticos
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toggleDescription(card) {
  const description = card.querySelector(".description-card");
  description.classList.toggle("description-hidden");
  if (description.classList.contains("description-hidden")) {
    description.style.display = "none";
  } else {
    description.style.display = "flex";
  }
}
function addListenersToCards() {
  const bigCard = document.getElementById("big-card");
  const upCard = document.getElementById("card-up");
  const downCard = document.getElementById("card-down");

  // add or remove class description-hidden when hover to the elemeent description-card inside of each card

  bigCard.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart-button")) {
      return;
    }

    toggleDescription(bigCard);
  });

  upCard.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart-button")) {
      return;
    }
    toggleDescription(upCard);
  });

  downCard.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart-button")) {
      return;
    }
    toggleDescription(downCard);
  });
}

function addEventListenerCartAddButton() {
  const cartAddButton = document.getElementById("add-cart-button");
  cartAddButton.addEventListener("click", (e) => {
    e.preventDefault();
  });
}

function createCard(product, cardType, discounts) {
  const card = document.createElement("div");
  card.classList.add(`${cardType}`);
  card.id = `${cardType}`;

  let discount = 0;

  discounts.forEach((descuento) => {
    if (descuento.id === product.id) {
      discount = descuento.discount;
    }
  });

  // Agregar flag de descuento
  let discountFlag = "";
  if (discount !== 0) {
    discountFlag = `
      <div class="flag">
        <p class="discount-flag">-${discount}% OFF</p>
      </div>
    `;
  }

  // crear el elemento de descuento

  let discountPrice = "";

  if (discount !== 0) {
    discountPrice = `
    <div class="price-catalog-card">
    <p class="discount-price">$${product.price}</p>
    <p class="discounted-price">-$${((product.price * discount) / 100).toFixed(
      2
    )}</p>
    <hr>
    <p class="final-price">$${(
      product.price -
      (product.price * discount) / 100
    ).toFixed(2)}</p>
  </div>
    `;
  } else {
    discountPrice = `
      <div class="price-${cardType}">
        <p class="discounted-price">$${product.price}</p>
      </div>
    `;
  }

  card.innerHTML = `
    ${discountFlag} <!-- Agregar la bandera de descuento -->
    <div class="title-${cardType}">${product.title}</div>
     ${discountPrice}
    <button class="add-cart-button" id="add-cart-button-${product.id}" onclick="addToCart(${product.id})">Agregar al carrito</button>
    <div class="description-card description-hidden">${product.description}</div>
  `;

  card.style.backgroundImage = `url(${product.image})`;

  return card;
}

function createHero(json, discounts) {
  const cardsContainer = document.querySelector(".cards-hero");

  const bigCardProduct = json[(Math.random() * json.length) | 0];
  const upCardProduct = json[(Math.random() * json.length) | 0];
  const downCardProduct = json[(Math.random() * json.length) | 0];

  const bigCard = createCard(bigCardProduct, "big-card", discounts);
  const upCard = createCard(upCardProduct, "card-up", discounts);
  upCard.classList.add("card-side");
  const downCard = createCard(downCardProduct, "card-down", discounts);
  downCard.classList.add("card-side");

  const side = document.createElement("div");
  side.classList.add("side");
  side.appendChild(upCard);
  side.appendChild(downCard);

  cardsContainer.innerHTML = ""; // Limpiamos el contenedor antes de agregar las tarjetas
  cardsContainer.appendChild(bigCard);
  cardsContainer.appendChild(side);
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

  const response = await fetch(
    "http://localhost:3000/suscribe?email=" + emailInput.value
  );
  const responseData = await response.json();

  if (responseData.error) {
    showToast(responseData.error, "error");
  } else {
    showToast(responseData.message, "info");
  }
}
