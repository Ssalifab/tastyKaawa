/*=====================================================
    TASTY KAAWA SHOP
=====================================================*/


/*=====================================================
RENDER PRODUCTS
=====================================================*/

function renderProducts(

    products = PRODUCTS

){

    const grid =

    document.getElementById(

        "productGrid"

    );

    if(!grid) return;

    grid.innerHTML = "";

    products.forEach(product=>{

        grid.innerHTML +=

        createProductCard(product);

    });

}


/*=====================================================
PRODUCT CARD
=====================================================*/

function createProductCard(product){

return `

<div class="col-lg-4 col-md-6 mb-4">

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

<p>

<strong>

Grade:

</strong>

${product.grade}

</p>

<div class="price">

${formatUGX(product.price)}

<small>

/ ${product.unit}

</small>

</div>

<div class="mt-3">

<input

type="number"

class="form-control"

id="qty-${product.id}"

value="1"

min="1"

max="100">

</div>

<div class="d-grid mt-3">

<button

class="btn-coffee"

onclick="shopAddToCart(${product.id})">

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

function shopAddToCart(productId){

    const quantityBox = document.getElementById(

        `qty-${productId}`

    );

    let quantity = Number(quantityBox.value);

    if(isNaN(quantity) || quantity < 1){

        quantity = 1;

    }

    const product = getProduct(productId);

    if(!product){

        showNotification(

            "Product not found.",

            "danger"

        );

        return;

    }

    addToCart(

        productId,

        quantity

    );

    quantityBox.value = 1;

    showNotification(

        `${quantity} ${product.unit} of ${product.name} added to cart.`,

        "success"

    );

}


/*=====================================================
SEARCH PRODUCTS
=====================================================*/

function initialiseSearch(){

    const search =

        document.getElementById(

            "searchProduct"

        );

    if(!search) return;

    search.addEventListener(

        "input",

        function(){

            const keyword =

                this.value

                .trim()

                .toLowerCase();

            const filtered =

                PRODUCTS.filter(product =>

                    product.name.toLowerCase().includes(keyword) ||

                    product.process.toLowerCase().includes(keyword) ||

                    product.grade.toLowerCase().includes(keyword) ||

                    product.description.toLowerCase().includes(keyword)

                );

            renderProducts(filtered);

        }

    );

}
/*=====================================================
CATEGORY FILTERS
=====================================================*/

function initialiseFilters(){

    const buttons = document.querySelectorAll(

        ".category-filter button"

    );

    buttons.forEach(button=>{

        button.addEventListener(

            "click",

            function(){

                buttons.forEach(btn=>{

                    btn.classList.remove("active");

                });

                this.classList.add("active");

                const category =

                    this.dataset.category;

                if(category==="all"){

                    renderProducts();

                    return;

                }

                const filtered =

                    PRODUCTS.filter(product=>

                        product.category===category

                    );

                renderProducts(filtered);

            }

        );

    });

}


/*=====================================================
SORT PRODUCTS
=====================================================*/

function sortProducts(type){

    let sorted = [...PRODUCTS];

    switch(type){

        case "priceLow":

            sorted.sort(

                (a,b)=>a.price-b.price

            );

            break;

        case "priceHigh":

            sorted.sort(

                (a,b)=>b.price-a.price

            );

            break;

        case "name":

            sorted.sort(

                (a,b)=>

                a.name.localeCompare(b.name)

            );

            break;

    }

    renderProducts(sorted);

}


/*=====================================================
RESET FILTERS
=====================================================*/

function resetFilters(){

    const search =

        document.getElementById(

            "searchProduct"

        );

    if(search){

        search.value="";

    }

    document

        .querySelectorAll(

            ".category-filter button"

        )

        .forEach(btn=>{

            btn.classList.remove("active");

        });

    const all =

        document.querySelector(

            '[data-category="all"]'

        );

    if(all){

        all.classList.add("active");

    }

    renderProducts();

}


/*=====================================================
MARKET PRICES
=====================================================*/

function renderMarketPrices(){

    const international =

        document.getElementById(

            "internationalPrices"

        );

    const uganda =

        document.getElementById(

            "ugandaPrices"

        );

    if(international){

        international.innerHTML="";

        MARKET_PRICES.international.forEach(item=>{

            international.innerHTML += `

<tr>

<td>${item.grade}</td>

<td class="text-end">

${item.price}

</td>

</tr>

`;

        });

    }

    if(uganda){

        uganda.innerHTML="";

        MARKET_PRICES.uganda.forEach(item=>{

            let value="";

            if(item.price){

                value = formatUGX(item.price);

            }

            else{

                value =

                formatUGX(item.min)

                +

                " - "

                +

                formatUGX(item.max);

            }

            uganda.innerHTML += `

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
INITIALISE SHOP
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        updateCartBadge();

        renderProducts();

        renderMarketPrices();

        initialiseSearch();

        initialiseFilters();

    }

);