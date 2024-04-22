function fillCatalog(json, discounts) {
  const cardsContainer = document.getElementById("catalog-cards");

  json.forEach((product) => {
    const card = createCatalogCard(product, discounts);
    cardsContainer.appendChild(card);
  });
}

function createCatalogCard(product, discounts) {
  const card = document.createElement("div");
  card.classList.add("card-catalog");

  let discount = 0;

  discounts.forEach((descuento) => {
    if (descuento.id === product.id) {
      discount = descuento.discount;
    }
  });

  let discountFlag = "";
  if (discount !== 0) {
    discountFlag = `
        <div class="flag">
          <p class="discount-flag">-${discount}% OFF</p>
        </div>
      `;
  }

  let discountPrice = "";
  let finalPrice = product.price;

  if (discount !== 0) {
    finalPrice = (product.price - (product.price * discount) / 100).toFixed(2);

    discountPrice = `
        <div class="price-catalog-card">
          <p class="discount-price">$${product.price}</p>
          <p class="discounted-price">-$${(
            (product.price * discount) /
            100
          ).toFixed(2)}</p>
          <hr>
          <p class="final-price">$${finalPrice}</p>
        </div>
      `;
  } else {
    discountPrice = `
        <div class="price-catalog-card">
          <p class="final-price">$${finalPrice}</p>
        </div>
      `;
  }

  card.innerHTML = `
      <span id="card-id" style="display: none">${product.id}</span>
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <div class="description-catalog-card">
      ${product.description.slice(0, 30) + "..."}
    </div>
      ${discountPrice}
      ${discountFlag}
      <div class="bottom-of-card">
      <div class="rating">
        ${stars(product.rating.rate)}
        <b>${product.rating.rate}</b> (${product.rating.count})
      </div>
      <button class="add-cart-button" id="add-cart-button-${
        product.id
      }" onclick="addToCart(${product.id})">Agregar al carrito</button>
      </div>
      <div class="description-catalog-full description-hidden">
        ${product.description}
      </div>
    `;

  return card;
}

function addListenersToCatalogCards() {
  const cards = document.querySelectorAll(".card-catalog");

  cards.forEach((card) => {
    const description = card.querySelector(".description-catalog-card");
    const descriptionFull = card.querySelector(".description-catalog-full");

    description.addEventListener("mouseover", () => {
      toggleCatalogDescription(card);
    });

    descriptionFull.addEventListener("mouseout", () => {
      toggleCatalogDescription(card);
    });
  });
}

function toggleCatalogDescription(card) {
  const description = card.querySelector(".description-catalog-card");
  const descriptionFull = card.querySelector(".description-catalog-full");

  if (description.classList.contains("description-hidden")) {
    description.classList.remove("description-hidden");
    descriptionFull.classList.add("description-hidden");
    descriptionFull.classList.remove("description-catalog-active");
  } else {
    description.classList.add("description-hidden");
    descriptionFull.classList.remove("description-hidden");
    descriptionFull.classList.add("description-catalog-active");
  }
}

function stars(rating) {
  rating = Math.floor(rating);
  let star = "";
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      star += `<i class="fa-solid fa-star" style="color: yellow"></i>`;
    } else {
      star += `<i class="fa-regular fa-star"></i>`;
    }
  }
  return star;
}
