/* ==========================================
   TASTY KAAWA SHOP
========================================== */

let cart = JSON.parse(localStorage.getItem("tastyCart")) || [];

/* ==========================================
   SAVE CART
========================================== */

function saveCart() {

    localStorage.setItem(
        "tastyCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}

/* ==========================================
   UPDATE CART BADGE
========================================== */

function updateCartCount() {

    const badge = document.getElementById("cartCount");

    if (!badge) return;

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    badge.textContent = total;

}

/* ==========================================
   ADD TO CART
========================================== */

function addToCart(id, name, price) {

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: id,
            name: name,
            price: Number(price),
            quantity: 1

        });

    }

    saveCart();

    showNotification(
        `${name} added to cart`
    );

}

/* ==========================================
   BUTTON EVENTS
========================================== */

document
.querySelectorAll(".add-cart")
.forEach(button => {

    button.addEventListener("click", () => {

        addToCart(

            button.dataset.id,

            button.dataset.name,

            button.dataset.price

        );

    });

});

/* ==========================================
   PRODUCT SEARCH
========================================== */

const searchInput =
document.getElementById("searchProduct");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword =
        this.value.toLowerCase();

        document
        .querySelectorAll(".product-card")
        .forEach(card => {

            const title =
            card.querySelector("h3")
            .textContent
            .toLowerCase();

            if (title.includes(keyword)) {

                card.parentElement.style.display = "";

            } else {

                card.parentElement.style.display = "none";

            }

        });

    });

}

/* ==========================================
   CATEGORY FILTER
========================================== */

const categoryButtons =
document.querySelectorAll(".category-filter button");

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        const category =
        this.textContent.trim().toLowerCase();

        document
        .querySelectorAll(".product-card")
        .forEach(card => {

            if (category === "all") {

                card.parentElement.style.display = "";

                return;

            }

            const title =
            card.querySelector("h3")
            .textContent
            .toLowerCase();

            if (title.includes(category.replace(" roast", ""))) {

                card.parentElement.style.display = "";

            } else {

                card.parentElement.style.display = "none";

            }

        });

    });

});

/* ==========================================
   INITIALISE SHOP
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

});