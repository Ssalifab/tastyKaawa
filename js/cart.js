/* ==========================================
   TASTY KAAWA CART
========================================== */

let cart = JSON.parse(localStorage.getItem("tastyCart")) || [];

const cartContainer = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");

const summaryItems = document.getElementById("summaryItems");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTotal = document.getElementById("summaryTotal");

const cartBadge = document.getElementById("cartCount");

/* ==========================================
   FORMAT CURRENCY
========================================== */

function formatUGX(amount) {

    return "UGX " + amount.toLocaleString();

}

/* ==========================================
   SAVE CART
========================================== */

function saveCart() {

    localStorage.setItem(
        "tastyCart",
        JSON.stringify(cart)
    );

    renderCart();

}

/* ==========================================
   UPDATE CART BADGE
========================================== */

function updateBadge() {

    if (!cartBadge) return;

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    cartBadge.textContent = total;

}

/* ==========================================
   INCREASE
========================================== */

function increase(id) {

    const item = cart.find(p => p.id == id);

    if(item){

        item.quantity++;

        saveCart();

    }

}

/* ==========================================
   DECREASE
========================================== */

function decrease(id) {

    const item = cart.find(p => p.id == id);

    if(item){

        item.quantity--;

        if(item.quantity <= 0){

            cart = cart.filter(p => p.id != id);

        }

        saveCart();

    }

}

/* ==========================================
REMOVE PRODUCT
========================================== */

function removeItem(id){

    cart = cart.filter(item => item.id != id);

    saveCart();

}
/* ==========================================
RENDER CART
========================================== */

function renderCart(){

    if(!cartContainer) return;

    cartContainer.innerHTML = "";

    if(cart.length === 0){

        emptyCart.style.display = "block";

        summaryItems.textContent = 0;

        summarySubtotal.textContent = "UGX 0";

        summaryTotal.textContent = "UGX 0";

        updateBadge();

        return;

    }

    emptyCart.style.display = "none";

    let subtotal = 0;

    let totalItems = 0;

        cart.forEach(item => {

        subtotal += item.price * item.quantity;

        totalItems += item.quantity;

        cartContainer.innerHTML += `

        <div class="cart-item">

            <div class="row align-items-center">

                <div class="col-md-5">

                    <h4>${item.name}</h4>

                    <p class="text-muted">

                        ${formatUGX(item.price)}

                    </p>

                </div>

                <div class="col-md-3 text-center">

                    <div class="quantity-controls d-flex justify-content-center align-items-center">

                        <button
                            class="btn btn-sm btn-outline-secondary"
                            onclick="decrease('${item.id}')">

                            -

                        </button>

                        <span class="mx-3 fw-bold">

                            ${item.quantity}

                        </span>

                        <button
                            class="btn btn-sm btn-outline-secondary"
                            onclick="increase('${item.id}')">

                            +

                        </button>

                    </div>

                </div>

                <div class="col-md-2 text-center">

                    <strong>

                        ${formatUGX(item.price * item.quantity)}

                    </strong>

                </div>

                <div class="col-md-2 text-end">

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="removeItem('${item.id}')">

                        <i class="fas fa-trash"></i>

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    summaryItems.textContent = totalItems;

    summarySubtotal.textContent = formatUGX(subtotal);

    summaryTotal.textContent = formatUGX(subtotal);

    updateBadge();

}

/* ==========================================
INITIALISE CART
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderCart();

});

/* ==========================================
ORDER INQUIRY
========================================== */

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (e) {

        e.preventDefault();

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;

        }

        const customer = {

            name: document.getElementById("customerName").value,

            email: document.getElementById("customerEmail").value,

            phone: document.getElementById("customerPhone").value,

            location: document.getElementById("customerLocation").value,

            notes: document.getElementById("customerNotes").value

        };

        let orderSummary = "";

        cart.forEach(item => {

            orderSummary +=

`${item.name}
Quantity: ${item.quantity}
Price: ${formatUGX(item.price)}

`;

        });

        console.log({

            customer,

            cart,

            orderSummary

        });

        alert(
            "Thank you! Your order inquiry has been received. We will contact you shortly."
        );

        cart = [];

        localStorage.removeItem("tastyCart");

        checkoutForm.reset();

        renderCart();

    });

}