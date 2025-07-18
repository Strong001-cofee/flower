// Initialize cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem("pollenCart")) || [];

// Get DOM elements for cart functionality
const cartCountSpan = document.getElementById("cart-count");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartTotalSpan = document.getElementById("cart-total");
const emptyCartMessage = document.getElementById("empty-cart-message");
const comingSoonModal = document.getElementById("comingSoonModal");

// Get DOM elements for "See More" functionality
const hiddenProductsContainer = document.getElementById("hidden-products");
const seeMoreBtn = document.getElementById("see-more-btn");

/**
 * Updates the cart count displayed in the navigation bar.
 */
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountSpan.textContent = totalItems;
}

/**
 * Saves the current cart state to localStorage.
 */
function saveCart() {
  localStorage.setItem("pollenCart", JSON.stringify(cart));
}

/**
 * Adds a product to the cart or increments its quantity if already present.
 * Also applies a temporary animation and text change to the clicked button.
 * @param {HTMLElement} buttonElement - The button element that was clicked.
 * @param {string} id - Unique ID of the product.
 * @param {string} name - Name of the product.
 * @param {number} price - Price of the product.
 * @param {string} image - URL of the product image.
 */
function addToCart(buttonElement, id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  saveCart();
  updateCartCount();

  // Store original text and classes
  const originalText = buttonElement.textContent;
  const originalClasses = Array.from(buttonElement.classList);

  // Apply animation class and change text
  buttonElement.textContent = "Added!";
  buttonElement.classList.add("add-to-cart-success");
  buttonElement.style.pointerEvents = "none"; // Disable clicks during animation

  // Revert button after animation duration
  setTimeout(() => {
    buttonElement.classList.remove("add-to-cart-success");
    // Reapply original classes to ensure hover effects etc. work again
    buttonElement.className = ""; // Clear current classes
    originalClasses.forEach((cls) => buttonElement.classList.add(cls)); // Add back original classes
    buttonElement.textContent = originalText;
    buttonElement.style.pointerEvents = "auto"; // Re-enable clicks
  }, 1500); // 1.5 seconds duration

  console.log(`${name} added to cart!`);
}

/**
 * Removes an item from the cart.
 * @param {string} id - ID of the product to remove.
 */
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart(); // Re-render cart after removal
  updateCartCount(); // Update count in navbar
}

/**
 * Renders the items in the cart overlay.
 */
function renderCart() {
  cartItemsContainer.innerHTML = ""; // Clear previous items
  let total = 0;

  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
    cartTotalSpan.textContent = "₹0";
    return;
  } else {
    emptyCartMessage.style.display = "none";
  }

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className =
      "flex items-center space-x-4 p-3 bg-gray-50 rounded-lg shadow-sm";
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${
      item.name
    }" class="w-16 h-16 object-cover rounded-md" />
      <div class="flex-1">
        <h4 class="font-semibold text-gray-800">${item.name}</h4>
        <p class="text-gray-600 text-sm">₹${item.price.toLocaleString(
          "en-IN"
        )} x ${item.quantity}</p>
      </div>
      <span class="font-bold text-gray-900">₹${(
        item.price * item.quantity
      ).toLocaleString("en-IN")}</span>
      <button onclick="removeFromCart('${
        item.id
      }')" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;
    cartItemsContainer.appendChild(itemElement);
    total += item.price * item.quantity;
  });

  cartTotalSpan.textContent = `₹${total.toLocaleString("en-IN")}`;
}

/**
 * Toggles the visibility of the cart overlay.
 */
function toggleCartView() {
  cartOverlay.classList.toggle("hidden");
  cartOverlay.classList.toggle("active"); // For modal animation
  if (!cartOverlay.classList.contains("hidden")) {
    renderCart(); // Render cart items when opening
  }
}

/**
 * Shows the "Coming Soon" message modal.
 */
function showComingSoonMessage() {
  comingSoonModal.classList.add("active");
  comingSoonModal.classList.remove("hidden");
  toggleCartView(); // Close the cart view when showing the message
}

/**
 * Hides the "Coming Soon" message modal.
 */
function hideComingSoonMessage() {
  comingSoonModal.classList.remove("active");
  comingSoonModal.classList.add("hidden");
}

/**
 * Toggles the visibility of additional product cards and animates the button.
 */
function toggleSeeMoreProducts() {
  const isHidden = hiddenProductsContainer.classList.contains("hidden");

  // Apply animation to the button
  seeMoreBtn.classList.add("see-more-button-animation");
  setTimeout(() => {
    seeMoreBtn.classList.remove("see-more-button-animation");
  }, 500); // Matches animation duration

  if (isHidden) {
    hiddenProductsContainer.classList.remove("hidden");
    // Optional: Add a fade-in animation to the revealed products if desired
    // Example: hiddenProductsContainer.querySelectorAll('.product-card').forEach(card => card.classList.add('fade-in-up'));
    seeMoreBtn.textContent = "Show Less Products";
  } else {
    hiddenProductsContainer.classList.add("hidden");
    seeMoreBtn.textContent = "See More Products";
    // Smooth scroll back to the top of the product section if "Show Less" is clicked
    document
      .getElementById("products")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// --- Existing JavaScript Functions ---

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
    // Close mobile menu if open
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
    }
  });
});

// Sticky navigation bar on scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shadow-lg");
  } else {
    navbar.classList.remove("shadow-lg");
  }
});

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
}

// Toggle search overlay
function toggleSearch() {
  const searchOverlay = document.getElementById("searchOverlay");
  searchOverlay.classList.toggle("hidden");
}

// Product filtering
function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    // Check if the product's data-category contains the selected category
    // This allows a product to belong to multiple categories (e.g., "bouquets birthday")
    if (category === "all" || product.dataset.category.includes(category)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });

  const filterButtons = document.querySelectorAll(".category-filter");
  filterButtons.forEach((button) => {
    button.classList.remove("active");
    // Check if the button's text content matches the category, case-insensitively
    // Or if the button represents 'All Products' and the category is 'all'
    if (
      button.textContent.toLowerCase().includes(category) ||
      (category === "all" &&
        button.textContent.toLowerCase().includes("all products"))
    ) {
      button.classList.add("active");
    }
  });

  // After filtering, ensure the "See More" button state is appropriate
  // If "All Products" is selected, and there are hidden products, show the "See More" button
  // Otherwise, hide it if all products are already visible or if a specific filter hides some.
  const allProductCards = document.querySelectorAll(".product-card");
  const visibleProductCards = Array.from(allProductCards).filter(
    (card) => card.style.display !== "none"
  );

  // Determine if there are more than 6 products visible after filtering
  if (category === "all" && allProductCards.length > 6) {
    seeMoreBtn.style.display = "block"; // Show the "See More" button
    // Reset the hidden products container to be hidden if "All" is chosen
    hiddenProductsContainer.classList.add("hidden");
    seeMoreBtn.textContent = "See More Products";
  } else if (category !== "all" && visibleProductCards.length > 6) {
    // If a specific filter is applied and there are still many items, keep "See More" logic
    seeMoreBtn.style.display = "block";
    hiddenProductsContainer.classList.add("hidden"); // Ensure hidden by default for new filters
    seeMoreBtn.textContent = "See More Products";
  } else {
    seeMoreBtn.style.display = "none"; // Hide the button if not enough products or specific filter
    hiddenProductsContainer.classList.remove("hidden"); // Ensure all relevant products are shown if button is hidden
  }
}

// Initial setup on page load
document.addEventListener("DOMContentLoaded", () => {
  filterProducts("all"); // Apply initial product filter
  updateCartCount(); // Load and display initial cart count

  // Initially hide products beyond the first 6
  const allProductCards = document.querySelectorAll(".product-card");
  if (allProductCards.length > 6) {
    for (let i = 6; i < allProductCards.length; i++) {
      hiddenProductsContainer.appendChild(allProductCards[i]);
    }
    hiddenProductsContainer.classList.add("hidden"); // Ensure it's hidden
    seeMoreBtn.style.display = "block"; // Show the button
  } else {
    seeMoreBtn.style.display = "none"; // Hide if not enough products to "see more"
  }
});
