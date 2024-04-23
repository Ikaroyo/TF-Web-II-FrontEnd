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
  refreshCart();
  displayCart(cart);
  addEventListenerShippingMethod();
  updateCheckout();
  addEventListenerCheckout();
  suscribeListener();
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

function addEventListenerShippingMethod() {
  const storeRadio = document.getElementById("store");
  const deliveryRadio = document.getElementById("delivery");
  const valueShipping = document.getElementById("shipping_checkout-value");

  storeRadio.addEventListener("change", () => {
    if (storeRadio.checked) {
      deliveryRadio.checked = false;
      valueShipping.innerHTML = "Gratis";
      updateCheckout();
    }
  });

  deliveryRadio.addEventListener("change", () => {
    if (deliveryRadio.checked) {
      storeRadio.checked = false;
      valueShipping.innerHTML = "$15";
      updateCheckout();
    }
  });
}

function displayCart(cart) {
  const cartContainer = document.getElementById("cart-fill");

  cart.forEach((item, index) => {
    const [id, quantity] = item;
    const product = json.find((product) => product.id == id);
    const productDiscount = discount.find(
      (discount) => discount.id === product.id
    );

    const card = document.createElement("div");
    card.classList.add("card-cart");
    card.setAttribute("data-id", id); // Agregar atributo data-id con el id del producto

    let finalPrice = product.price;

    let discountHTML = "";
    if (productDiscount) {
      finalPrice -= (product.price * productDiscount.discount) / 100;
      discountHTML = `
                <span class="product_discount">-$${(
                  (product.price * productDiscount.discount) /
                  100
                ).toFixed(2)}
                  <span class="discount_percentage">(-${
                    productDiscount.discount
                  }%OFF)</span>
                </span>`;
    }

    card.innerHTML = `
            <div class="img-prod">
              <img src="${product.image}" alt="${
      product.title
    }" class="product_img">
              <div class="product">
                <h3 class="product_name">${product.title}</h3>
                <span class="id_product">#${product.id}</span>
                <span class="description_product">${product.description}</span>
              </div>
            </div>
            <div class="price">
              <span class="product_price">$${product.price}</span>
              ${discountHTML}
              <hr>
              <span class="final_price">$${finalPrice.toFixed(2)}</span>
            </div>
            <div class="quantity">
              <i class="fa-solid fa-minus" onclick="decreaseFromCart(${id})"></i>
              <span>${quantity}</span>
              <i class="fa-solid fa-plus" onclick="increaseFromCart(${id})"></i>
            </div>
            <div class="subtotal">
              <span class="subtotal_price">$${(finalPrice * quantity).toFixed(
                2
              )}</span>
            </div>
            <i class="fa-solid fa-trash" onclick="deleteFromCart(${id})"></i>
          `;

    cartContainer.appendChild(card);

    // Agregar línea horizontal entre elementos, pero no al final
    if (index < cart.length - 1) {
      const hr = document.createElement("hr");
      hr.classList.add("cart-hr");
      cartContainer.appendChild(hr);
    }
  });
}

function decreaseFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item[0].toString() === id.toString()); // Convertir a cadena y comparar
  if (index > -1) {
    if (cart[index][1] > 1) {
      cart[index][1]--;
      updateQuantity(id, cart[index][1]);
    } else {
      cart.splice(index, 1);
      deleteFromCart(id);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  refreshCart();
  fixHr();
  updateCheckout();
}

function increaseFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item[0].toString() === id.toString()); // Convertir a cadena y comparar
  if (index > -1) {
    cart[index][1]++;
    updateQuantity(id, cart[index][1]);
  } else {
    cart.push([id.toString(), 1]); // Convertir a cadena al agregar al carrito
    updateQuantity(id, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  refreshCart();
  fixHr();
  updateCheckout();
}

function updateQuantity(id, quantity) {
  const quantityElement = document.querySelector(
    `.card-cart[data-id="${id}"] .quantity span`
  );
  if (quantityElement) {
    quantityElement.textContent = quantity;
  }
  updateSubtotal(id, quantity);
}

function updateSubtotal(id, quantity) {
  const product = json.find((product) => product.id == id);
  const productDiscount = discount.find(
    (discount) => discount.id === product.id
  );

  let finalPrice = product.price;
  if (productDiscount) {
    finalPrice -= (product.price * productDiscount.discount) / 100;
  }

  const subtotalElement = document.querySelector(
    `.card-cart[data-id="${id}"] .subtotal .subtotal_price`
  );
  if (subtotalElement) {
    const subtotal = quantity * finalPrice;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  }
}

function refreshCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const count = cart.reduce((total, item) => total + item[1], 0);
  document.getElementById("cart-count").innerHTML = count;
}

function deleteFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item[0].toString() === id.toString()); // Convertir a cadena y comparar
  if (index > -1) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCart();
    const card = document.querySelector(`.card-cart[data-id="${id}"]`);
    if (card) {
      card.remove();
      fixHr();
    }
  }
  updateCheckout();
}

function fixHr() {
  const cartFill = document.querySelector("#cart-fill");
  const allCards = document.querySelectorAll(".card-cart");
  const allHr = document.querySelectorAll(".cart-hr");

  // Eliminar todas las líneas horizontales existentes
  allHr.forEach((hr) => {
    hr.remove();
  });

  // Agregar una nueva línea horizontal entre cada tarjeta
  allCards.forEach((card, index) => {
    const hr = document.createElement("hr");
    hr.classList.add("cart-hr");

    // Evitar agregar una línea horizontal después de la última tarjeta
    if (index !== allCards.length - 1) {
      // Agregar la línea horizontal después de cada tarjeta
      card.after(hr);
    }
  });
}

function updateCheckout() {
  const subtotalsValue = document.getElementById("subtotal_checkout-value");
  const shippingValue = document.getElementById("shipping_checkout-value");
  const totalValue = document.getElementById("total_checkout");
  const totalToPayValue = document.getElementById("total_to_pay");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach((item) => {
    const product = json.find((product) => product.id == item[0]);
    const productDiscount = discount.find(
      (discount) => discount.id === product.id
    );

    let finalPrice = product.price;

    if (productDiscount) {
      finalPrice -= (product.price * productDiscount.discount) / 100;
    }

    total += finalPrice * item[1];
  });

  subtotalsValue.textContent = `$${total.toFixed(2)}`;

  if (shippingValue.innerText === "Gratis") {
    totalValue.textContent = `$${total.toFixed(2)}`;
    totalToPayValue.textContent = `$${total.toFixed(2)}`;
  } else {
    const shippingCost = parseFloat(shippingValue.innerText.replace("$", ""));
    const grandTotal = total + shippingCost;
    totalValue.textContent = `$${grandTotal.toFixed(2)}`;
    totalToPayValue.textContent = `$${grandTotal.toFixed(2)}`;
  }
}

async function addEventListenerCheckout() {
  const btnCheckout = document.getElementById("btn-checkout");
  btnCheckout.addEventListener("click", async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      showToast("No hay elementos en el carrito", "error");
      return;
    }

    const cartJson = prepareCartToJson();

    try {
      const queryString =
        "?data=" + encodeURIComponent(JSON.stringify(cartJson));
      const response = await fetch(apiUrl + "/checkout" + queryString);
      const data = await response.json();
      if (data && data.message) {
        showToast(data.message, "success");
      } else {
        showToast("Error al realizar el pedido", "error");
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function prepareCartToJson() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartJson = cart.map((item) => {
    const product = json.find((product) => product.id == item[0]);
    const productDiscount = discount.find(
      (discount) => discount.id === product.id
    );

    let finalPrice = product.price;

    if (productDiscount) {
      finalPrice -= (product.price * productDiscount.discount) / 100;
    }

    return {
      id: product.id,
      name: product.title,
      price: finalPrice.toFixed(2),
      quantity: item[1],
    };
  });

  // add shipping cost

  const shippingValue = document.getElementById("shipping_checkout-value");

  if (shippingValue.innerText === "Gratis") {
    cartJson.push({ id: -100, name: "Shipping", price: 0, quantity: 1 });
  } else {
    cartJson.push({
      id: -100,
      name: "Shipping",
      price: parseFloat(shippingValue.innerText.replace("$", "")),
      quantity: 1,
    });
  }

  return cartJson;
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
