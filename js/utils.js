/*=====================================================
    TASTY KAAWA UTILITIES
=====================================================*/


/*=====================================================
FORMAT CURRENCY
=====================================================*/

function formatUGX(amount){

    return "UGX " +

    Number(amount).toLocaleString("en-UG");

}


/*=====================================================
LOAD CART
=====================================================*/

function loadCart(){

    const cart = JSON.parse(

        localStorage.getItem("tastyCart")

    );

    return Array.isArray(cart)

        ? cart

        : [];

}


/*=====================================================
SAVE CART
=====================================================*/

function saveCart(cart){

    localStorage.setItem(

        "tastyCart",

        JSON.stringify(cart)

    );

    updateCartBadge();

}


/*=====================================================
CLEAR CART
=====================================================*/

function clearCart(){

    localStorage.removeItem(

        "tastyCart"

    );

    updateCartBadge();

}


/*=====================================================
GET PRODUCT
=====================================================*/

function getProduct(id){

    return PRODUCTS.find(product =>

        Number(product.id) === Number(id)

    );

}


/*=====================================================
GET CART INDEX
=====================================================*/

function getCartIndex(cart,id){

    return cart.findIndex(item =>

        Number(item.id) === Number(id)

    );

}
/*=====================================================
GET CART PRODUCTS
=====================================================*/

function getCartProducts(){

    const cart = loadCart();

    return cart

        .map(item => {

            const product = getProduct(item.id);

            if(!product) return null;

            return{

                ...product,

                quantity: item.quantity

            };

        })

        .filter(product => product !== null);

}


/*=====================================================
ADD TO CART
=====================================================*/

function addToCart(productId, quantity = 1){

    let cart = loadCart();

    quantity = Number(quantity);

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

            id: Number(productId),

            quantity: quantity

        });

    }

    saveCart(cart);

}


/*=====================================================
INCREASE QUANTITY
=====================================================*/

function increaseQuantity(productId){

    let cart = loadCart();

    const index = getCartIndex(

        cart,

        productId

    );

    if(index === -1) return;

    cart[index].quantity++;

    saveCart(cart);

}


/*=====================================================
DECREASE QUANTITY
=====================================================*/

function decreaseQuantity(productId){

    let cart = loadCart();

    const index = getCartIndex(

        cart,

        productId

    );

    if(index === -1) return;

    cart[index].quantity--;

    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }

    saveCart(cart);

}


/*=====================================================
REMOVE PRODUCT
=====================================================*/

function removeProduct(productId){

    let cart = loadCart();

    cart = cart.filter(item =>

        Number(item.id) !== Number(productId)

    );

    saveCart(cart);

}
/*=====================================================
UPDATE CART BADGE
=====================================================*/

function updateCartBadge(){

    const badge = document.getElementById("cartCount");

    if(!badge) return;

    const cart = loadCart();

    const total = cart.reduce(

        (sum,item)=>sum + item.quantity,

        0

    );

    badge.textContent = total;

}


/*=====================================================
SHOW NOTIFICATION
=====================================================*/

function showNotification(

    message,

    type="success"

){

    const alert = document.createElement("div");

    alert.className =

    `alert alert-${type} shadow-lg position-fixed`;

    alert.style.top = "100px";

    alert.style.right = "25px";

    alert.style.zIndex = "99999";

    alert.style.minWidth = "320px";

    alert.style.borderRadius = "12px";

    alert.innerHTML = `

<i class="fas fa-check-circle me-2"></i>

${message}

`;

    document.body.appendChild(alert);

    setTimeout(()=>{

        alert.remove();

    },2500);

}


/*=====================================================
ORDER NUMBER
=====================================================*/

function generateOrderNumber(){

    const now = new Date();

    const random =

        Math.floor(

            Math.random()*9000

        ) + 1000;

    return

 `TK-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${random}`;

}


/*=====================================================
EMAIL VALIDATION
=====================================================*/

function validEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    .test(email);

}


/*=====================================================
PHONE VALIDATION
=====================================================*/

function validPhone(phone){

    return /^[0-9+\-\s]{9,15}$/

    .test(phone);

}
/*=====================================================
GET CART PRODUCTS
=====================================================*/

function getCartProducts(){

    const cart = loadCart();

    return cart
        .map(item => {

            const product = getProduct(item.id);

            if(!product) return null;

            return {

                ...product,

                quantity: item.quantity

            };

        })
        .filter(product => product !== null);

}


/*=====================================================
ADD TO CART
=====================================================*/

function addToCart(productId, quantity = 1){

    let cart = loadCart();

    quantity = Number(quantity);

    if(isNaN(quantity) || quantity < 1){

        quantity = 1;

    }

    const index = getCartIndex(cart, productId);

    if(index > -1){

        cart[index].quantity += quantity;

    }
    else{

        cart.push({

            id:Number(productId),

            quantity:quantity

        });

    }

    saveCart(cart);

}


/*=====================================================
INCREASE QUANTITY
=====================================================*/

function increaseQuantity(productId){

    const cart = loadCart();

    const index = getCartIndex(cart, productId);

    if(index === -1) return;

    cart[index].quantity++;

    saveCart(cart);

}


/*=====================================================
DECREASE QUANTITY
=====================================================*/

function decreaseQuantity(productId){

    const cart = loadCart();

    const index = getCartIndex(cart, productId);

    if(index === -1) return;

    cart[index].quantity--;

    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }

    saveCart(cart);

}


/*=====================================================
REMOVE PRODUCT
=====================================================*/

function removeProduct(productId){

    let cart = loadCart();

    cart = cart.filter(item =>

        Number(item.id) !== Number(productId)

    );

    saveCart(cart);

}