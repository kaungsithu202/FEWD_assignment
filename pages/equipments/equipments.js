"use strict";
AOS.init();
const emblaNode = document.querySelector(".embla");
const options = { loop: true, speed: 10 };
const plugins = [
  EmblaCarouselAutoplay({
    delay: 2300,
    playOnInit: true,
  }),
  EmblaCarouselFade({ intensity: 0.8 }),
];
const emblaApi = EmblaCarousel(emblaNode, options, plugins);

const products = {
  "Hot Coffee": [
    {
      id: 1,
      name: "Morning Bliss",
      description: "Smooth and rich with a hint of caramel.",
      price: "$12.99",
      image: "https://placehold.co/600x400",
    },
    {
      id: 2,
      name: "Dark Roast Supreme",
      description: "Bold flavor with dark chocolate notes.",
      price: "$14.50",
      image: "https://placehold.co/600x400",
    },
  ],
  "Cold Coffee": [
    {
      id: 3,
      name: "Hazelnut Harmony",
      description: "Nutty blend with smooth finish.",
      price: "$13.25",
      image: "https://placehold.co/600x400",
    },
    {
      id: 4,
      name: "Vanilla Velvet",
      description: "Creamy vanilla flavor for a sweet treat.",
      price: "$13.75",
      image: "https://placehold.co/600x400",
    },
  ],
  "Iced Coffee": [
    {
      id: 5,
      name: "Espresso Energy",
      description: "Strong and sharp espresso blend.",
      price: "$15.00",
      image: "https://placehold.co/600x400",
    },
  ],
  Tea: [
    {
      id: 6,
      name: "Cinnamon Swirl",
      description: "Spicy cinnamon with a smooth finish.",
      price: "$13.00",
      image: "https://placehold.co/600x400",
    },
  ],
};

// Create a flat array of all products for search functionality
const allProducts = Object.entries(products).reduce(
  (acc, [category, items]) => {
    // Add category to each product for filtering later
    const productsWithCategory = items.map((item) => ({ ...item, category }));
    return [...acc, ...productsWithCategory];
  },
  []
);

const fuse = new Fuse(allProducts, {
  keys: ["name", "description", "category"],
});

const input = document.querySelector(".category__input");

input.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim();

  if (searchTerm === "") {
    // If search is empty, show all products by category
    renderAllCategories(products);
  } else {
    // Otherwise show search results
    const results = fuse.search(searchTerm).map((r) => r.item);

    // Group results by category
    const resultsByCategory = results.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    renderAllCategories(resultsByCategory);
  }
});

function renderAllCategories(categorizedProducts) {
  const container = document.querySelector(".category__content");
  container.innerHTML = ""; // Clear existing content

  // Check if any categories have products
  const hasResults = Object.values(categorizedProducts).some(
    (items) => items.length > 0
  );

  if (!hasResults) {
    container.innerHTML = `<p class="no-results">No products found matching your search.</p>`;
    return;
  }

  // Render each category
  for (const [category, items] of Object.entries(categorizedProducts)) {
    // Skip empty categories
    if (items.length === 0) continue;

    // Create category wrapper
    const categoryWrapper = document.createElement("div");
    categoryWrapper.className = "category__item--wrapper";

    // Format category name (capitalize first letter)

    // Add category title
    categoryWrapper.innerHTML = `
      <h2 class="category__title">${category}</h2>
      <div class="category__items"></div>
    `;

    // Get reference to the items container
    const itemsContainer = categoryWrapper.querySelector(".category__items");

    // Add each product to the items container
    items.forEach((p) => {
      const item = document.createElement("div");
      item.className = "category__item" + "aos-init aos-animate";
      item.setAttribute("data-aos", "fade-up");

      item.innerHTML = `
        <div class="category__image--wrapper">
          <img
            class="category__image"
            src="${p.image}"
            alt="${p.name}"
            width="300"
            height="300"
          />
        </div>
        <h3 class="category__name">${p.name}</h3>
        <p class="category__description">${p.description}</p>
        <p class="category__price">${p.price}</p>
      `;

      itemsContainer.appendChild(item);
    });

    // Add the complete category to the main container
    container.appendChild(categoryWrapper);
  }

  AOS.refresh();
}

// Initial render
renderAllCategories(products);
