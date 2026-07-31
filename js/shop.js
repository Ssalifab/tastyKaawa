/*=====================================================
    TASTY KAAWA SHOP
=====================================================*/

let cart = loadCart();


/*=====================================================
RENDER PRODUCTS
=====================================================*/

function renderProducts(productList = PRODUCTS){

    const grid = document.getElementById("productGrid");

    if(!grid) return;

    grid.innerHTML = "";

    productList.forEach(product=>{

        grid.innerHTML += createProductCard(product);

    });

}


/*=====================================================
PRODUCT CARD
=====================================================*/

function createProductCard(product){

    return `

<div class="col-lg-4 col-md-6">

<div class="product-card h-100 shadow-sm">

<img

src="${product.image}"

class="img-fluid rounded"

alt="${product.name}">

<div class="mt-3">

<span class="badge-coffee">

${product.process}

</span>

<h3 class="mt-3">

${product.name}

</h3>

<p>

${product.description}

</p>

<div class="mb-2">

<strong>

Grade:

</strong>

${product.grade}

</div>

<div class="price">

${formatUGX(product.price)}

<small>

/ ${product.unit}

</small>

</div>

<div class="mt-3">

<input

type="number"

id="qty-${product.id}"

class="form-control"

value="1"

min="1"

max="100">

</div>

<div class="mt-3 d-grid">

<button

class="btn-coffee"

onclick="addToCart(${product.id})">

<i class="fas fa-cart-plus"></i>

Add To Cart

</button>

</div>

</div>

</div>

</div>

`;

}


/*=====================================================
ADD TO CART
=====================================================*/

function addToCart(productId){

    const product = getProduct(productId);

    if(!product) return;

    const qtyBox = document.getElementById(

        `qty-${productId}`

    );

    let quantity = parseInt(qtyBox.value);

    if(isNaN(quantity) || quantity < 1){

        quantity = 1;

    }

    const index = getCartIndex(

        cart,

        productId

    );

    if(index > -1){

        cart[index].quantity += quantity;

    }

    else{

        cart.push({

            id: product.id,

            quantity: quantity

        });

    }

    saveCart(cart);

    qtyBox.value = 1;

    showNotification(

        `${product.name} added to cart.`

    );

}
/*=====================================================
SEARCH PRODUCTS
=====================================================*/

function initialiseSearch() {

    const searchBox = document.getElementById("searchProduct");

    if (!searchBox) return;

    searchBox.addEventListener("input", function () {

        const keyword = this.value.trim().toLowerCase();

        const filtered = PRODUCTS.filter(product =>

            product.name.toLowerCase().includes(keyword) ||

            product.process.toLowerCase().includes(keyword) ||

            product.grade.toLowerCase().includes(keyword) ||

            product.description.toLowerCase().includes(keyword)

        );

        renderProducts(filtered);

    });

}


/*=====================================================
CATEGORY FILTERS
=====================================================*/

function initialiseFilters() {

    const buttons = document.querySelectorAll(

        ".category-filter button"

    );

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            buttons.forEach(btn =>

                btn.classList.remove("active")

            );

            this.classList.add("active");

            const category = this.dataset.category;

            if (category === "all") {

                renderProducts();

                return;

            }

            const filtered = PRODUCTS.filter(product =>

                product.category === category

            );

            renderProducts(filtered);

        });

    });

}


/*=====================================================
RENDER MARKET PRICES
=====================================================*/

function renderMarketPrices() {

    const internationalTable = document.getElementById(

        "internationalPrices"

    );

    const ugandaTable = document.getElementById(

        "ugandaPrices"

    );

    if (internationalTable) {

        internationalTable.innerHTML = "";

        MARKET_PRICES.international.forEach(item => {

            internationalTable.innerHTML += `

<tr>

    <td>${item.grade}</td>

    <td class="text-end">

        ${item.price}

    </td>

</tr>

`;

        });

    }

    if (ugandaTable) {

        ugandaTable.innerHTML = "";

        MARKET_PRICES.uganda.forEach(item => {

            let value = "";

            if (item.price) {

                value = formatUGX(item.price);

            }

            else {

                value =

                    formatUGX(item.min)

                    +

                    " - "

                    +

                    formatUGX(item.max);

            }

            ugandaTable.innerHTML += `

<tr>

    <td>${item.grade}</td>

    <td class="text-end">

        ${value}

    </td>

</tr>

`;

        });

    }

}


/*=====================================================
SORT PRODUCTS
=====================================================*/

function sortProducts(type) {

    let sorted = [...PRODUCTS];

    switch (type) {

        case "priceLow":

            sorted.sort((a, b) =>

                a.price - b.price

            );

            break;

        case "priceHigh":

            sorted.sort((a, b) =>

                b.price - a.price

            );

            break;

        case "name":

            sorted.sort((a, b) =>

                a.name.localeCompare(b.name)

            );

            break;

    }

    renderProducts(sorted);

}


/*=====================================================
RESET SEARCH
=====================================================*/

function resetFilters() {

    const search = document.getElementById("searchProduct");

    if (search) {

        search.value = "";

    }

    document

        .querySelectorAll(".category-filter button")

        .forEach(btn =>

            btn.classList.remove("active")

        );

    const allButton = document.querySelector(

        '[data-category="all"]'

    );

    if (allButton) {

        allButton.classList.add("active");

    }

    renderProducts();

}


/*=====================================================
INITIALISE SHOP
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        updateCartBadge();

        renderProducts();

        renderMarketPrices();

        initialiseSearch();

        initialiseFilters();

    }

);