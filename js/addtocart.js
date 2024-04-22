function addToCart(id) {
  // use local storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.findIndex((item) => item[0] === id);

  if (index > -1) {
    cart[index][1] += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCart();
    fixButtons();
  } else {
    if (json && json.length > 0) {
      const product = json.find((product) => product.id == id);
      if (product) {
        const title = product.title;
        cart.push([id, 1]);
        showToast(`${title} Añadido al carrito`, "success");
        localStorage.setItem("cart", JSON.stringify(cart));
        refreshCart();
        fixButtons();
      } else {
        console.error(`No se encontró ningún producto con ID ${id}`);
      }
    } else {
      console.error("No hay datos de productos disponibles");
    }
  }
  updateAddCatalogButton(id);
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item[0] === id);
  if (index > -1) {
    cart.splice(index, 1);
    const title = json.find((product) => product.id == id).title;
    showToast(`${title} Removido del carrito`, "error");
    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCart();
    fixButtons();
  }
  updateAddCatalogButton(id);
}

function refreshCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const count = cart.reduce((total, item) => total + item[1], 0);
  document.getElementById("cart-count").innerHTML = count;
}

function updateAddCatalogButton(id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item[0] === id);

  const addButton = document.getElementById("add-cart-button-" + id);

  if (index > -1) {
    addButton.textContent = "Remover del carrito";
    addButton.onclick = () => removeFromCart(id);
    addButton.classList.add("remove-cart-button");
    fixButtons();
  } else {
    addButton.textContent = "Agregar al carrito";
    addButton.onclick = () => addToCart(id);
    addButton.classList.remove("remove-cart-button");
    fixButtons();
  }
}

// function to check every button if it's in the cart

function fixButtons() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let buttons = document.querySelectorAll(".add-cart-button");

  buttons.forEach((button) => {
    const id = button.id.split("-")[3]; // Corregido el índice para obtener el ID correctamente
    const index = cart.findIndex((item) => item[0] === id);
    if (index > -1) {
      button.textContent = "Remover del carrito";
      button.onclick = () => removeFromCart(id);
      button.classList.add("remove-cart-button");
    } else {
      button.textContent = "Agregar al carrito"; // Cambia el texto si el elemento no está en el carrito
      button.onclick = () => addToCart(id); // Cambia el evento click
      button.classList.remove("remove-cart-button");
    }
  });
}
