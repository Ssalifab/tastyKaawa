/*=====================================================
    TASTY KAAWA CART
=====================================================*/

let cart = loadCart();


/*=====================================================
GET CART PRODUCTS
=====================================================*/

function getCartProducts(){

    return cart.map(cartItem=>{

        const product = getProduct(cartItem.id);

        if(!product) return null;

        return{

            ...product,

            quantity: cartItem.quantity

        };

    }).filter(item=>item!==null);

}


/*=====================================================
RENDER CART
=====================================================*/

function renderCart(){

    const container = document.getElementById("cartItems");

    const empty = document.getElementById("emptyCart");

    if(!container) return;

    container.innerHTML="";

    const products = getCartProducts();

    if(products.length===0){

        empty.style.display="block";

        updateSummary(0,0);

        return;

    }

    empty.style.display="none";

    let subtotal = 0;

    let totalItems = 0;

    products.forEach(product=>{

        subtotal += product.price * product.quantity;

        totalItems += product.quantity;

        container.innerHTML += createCartCard(product);

    });

    updateSummary(

        totalItems,

        subtotal

    );

}


/*=====================================================
CREATE PRODUCT CARD
=====================================================*/

function createCartCard(product){

    return `

<div class="card shadow-sm border-0 rounded-4 mb-4">

<div class="card-body">

<div class="row align-items-center">

<div class="col-lg-3">

<img

src="${product.image}"

class="img-fluid rounded"

alt="${product.name}">

</div>

<div class="col-lg-4">

<h4>

${product.name}

</h4>

<p class="small text-muted">

${product.description}

</p>

<div class="mt-2">

<span class="badge-coffee">

${product.process}

</span>

</div>

<div class="mt-2">

<strong>

${product.grade}

</strong>

</div>

<div class="mt-2">

${formatUGX(product.price)}

/

${product.unit}

</div>

</div>

<div class="col-lg-3">

<div class="input-group">

<button

class="btn btn-outline-secondary"

onclick="decrease(${product.id})">

-

</button>

<input

class="form-control text-center"

value="${product.quantity}"

readonly>

<button

class="btn btn-outline-secondary"

onclick="increase(${product.id})">

+

</button>

</div>

</div>

<div class="col-lg-2 text-end">

<h5>

${formatUGX(

product.price*product.quantity

)}

</h5>

<button

class="btn btn-outline-danger mt-3"

onclick="removeItem(${product.id})">

<i class="fas fa-trash"></i>

</button>

</div>

</div>

</div>

</div>

`;

}
/*=====================================================
INCREASE QUANTITY
=====================================================*/

function increase(productId){

    const index = getCartIndex(cart, productId);

    if(index === -1) return;

    cart[index].quantity++;

    saveCart(cart);

    renderCart();

}


/*=====================================================
DECREASE QUANTITY
=====================================================*/

function decrease(productId){

    const index = getCartIndex(cart, productId);

    if(index === -1) return;

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }

    else{

        cart.splice(index,1);

    }

    saveCart(cart);

    renderCart();

}


/*=====================================================
REMOVE PRODUCT
=====================================================*/

function removeItem(productId){

    const confirmed = confirm(

        "Remove this product from your cart?"

    );

    if(!confirmed) return;

    const index = getCartIndex(cart, productId);

    if(index > -1){

        cart.splice(index,1);

    }

    saveCart(cart);

    renderCart();

}


/*=====================================================
UPDATE SUMMARY
=====================================================*/

function updateSummary(totalItems, subtotal){

    document.getElementById(

        "summaryItems"

    ).textContent = totalItems;

    document.getElementById(

        "summarySubtotal"

    ).textContent = formatUGX(subtotal);

    document.getElementById(

        "summaryTotal"

    ).textContent = formatUGX(subtotal);

    updateCartBadge();

}


/*=====================================================
BUILD ORDER
=====================================================*/

function buildOrder(){

    const customer = {

        name:

            document.getElementById("customerName").value.trim(),

        email:

            document.getElementById("customerEmail").value.trim(),

        phone:

            document.getElementById("customerPhone").value.trim(),

        location:

            document.getElementById("deliveryLocation").value.trim(),

        customerType:

            document.getElementById("customerType").value,

        preferredContact:

            document.getElementById("preferredContact").value,

        notes:

            document.getElementById("customerNotes").value.trim(),

        newsletter:

            document.getElementById("newsletter").checked

    };

    let totalAmount = 0;

    let totalItems = 0;

    const orderItems = getCartProducts().map(product=>{

        const lineTotal =

            product.price * product.quantity;

        totalAmount += lineTotal;

        totalItems += product.quantity;

        return{

            id:product.id,

            name:product.name,

            process:product.process,

            grade:product.grade,

            unit:product.unit,

            unitPrice:product.price,

            quantity:product.quantity,

            lineTotal:lineTotal

        };

    });

    return{

        orderNumber:

            generateOrderNumber(),

        orderDate:

            new Date().toISOString(),

        currency:"UGX",

        customer:customer,

        items:orderItems,

        totalItems:totalItems,

        totalAmount:totalAmount

    };

}


/*=====================================================
CHECKOUT
=====================================================*/

const checkoutForm =

document.getElementById("checkoutForm");

if(checkoutForm){

    checkoutForm.addEventListener(

        "submit",

        submitOrder

    );

}


function submitOrder(e){

    e.preventDefault();

    if(cart.length===0){

        showNotification(

            "Your cart is empty.",

            "warning"

        );

        return;

    }

    const email =

        document.getElementById(

            "customerEmail"

        ).value;

    if(!validEmail(email)){

        showNotification(

            "Please enter a valid email address.",

            "danger"

        );

        return;

    }

    const phone =

        document.getElementById(

            "customerPhone"

        ).value;

    if(!validPhone(phone)){

        showNotification(

            "Please enter a valid phone number.",

            "danger"

        );

        return;

    }

    const order = buildOrder();

    console.log(order);

    /*
    ===============================================
    NETLIFY FUNCTION

    fetch("/.netlify/functions/order",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(order)

    })

    ===============================================
    */

    alert(

`Thank you for your order!

Order Number:

${order.orderNumber}

Our sales team will contact you shortly to confirm pricing, payment and delivery.`

    );

    cart = [];

    clearCart();

    checkoutForm.reset();

    renderCart();

}


/*=====================================================
INITIALISE
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function(){

        cart = loadCart();

        updateCartBadge();

        renderCart();

    }

);