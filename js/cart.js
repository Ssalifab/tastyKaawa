/*=====================================================
    TASTY KAAWA CART
=====================================================*/


/*=====================================================
GET CURRENT CART
Always read from LocalStorage
=====================================================*/

function getCurrentCart(){

    return getCartProducts();

}


/*=====================================================
RENDER CART
=====================================================*/

function renderCart(){

    const products = getCurrentCart();

    const container =
        document.getElementById("cartItems");

    const empty =
        document.getElementById("emptyCart");

    if(!container) return;

    container.innerHTML = "";

    if(products.length === 0){

        empty.style.display = "block";

        updateSummary(0,0);

        updateCartBadge();

        return;

    }

    empty.style.display = "none";

    let totalItems = 0;

    let subtotal = 0;

    products.forEach(product=>{

        totalItems += product.quantity;

        subtotal +=

            product.quantity *

            product.price;

        container.innerHTML +=

            createCartCard(product);

    });

    updateSummary(

        totalItems,

        subtotal

    );

    updateCartBadge();

}


/*=====================================================
CREATE CART CARD
=====================================================*/

function createCartCard(product){

return `

<div class="card border-0 shadow-sm rounded-4 mb-4">

<div class="card-body">

<div class="row align-items-center gy-3">

<div class="col-lg-3 text-center">

<img

src="${product.image}"

class="img-fluid rounded-4"

alt="${product.name}">

</div>

<div class="col-lg-4">

<span class="badge-coffee">

${product.process}

</span>

<h4 class="mt-3">

${product.name}

</h4>

<p class="text-muted">

${product.description}

</p>

<p class="mb-1">

<strong>

Grade:

</strong>

${product.grade}

</p>

<p>

<strong>

${formatUGX(product.price)}

</strong>

/

${product.unit}

</p>

</div>

<div class="col-lg-3">

<div class="d-flex justify-content-center align-items-center">

<button

class="btn btn-outline-secondary"

onclick="decreaseItem(${product.id})">

−

</button>

<span class="mx-3 fw-bold">

${product.quantity}

</span>

<button

class="btn btn-outline-secondary"

onclick="increaseItem(${product.id})">

+

</button>

</div>

</div>

<div class="col-lg-2 text-center">

<h5>

${formatUGX(

product.quantity *

product.price

)}

</h5>

<button

class="btn btn-outline-danger btn-sm mt-2"

onclick="deleteItem(${product.id})">

<i class="fas fa-trash"></i>

</button>

</div>

</div>

</div>

</div>

`;

}


/*=====================================================
UPDATE SUMMARY
=====================================================*/

function updateSummary(

    totalItems,

    subtotal

){

    document.getElementById(

        "summaryItems"

    ).textContent = totalItems;

    document.getElementById(

        "summarySubtotal"

    ).textContent = formatUGX(subtotal);

    document.getElementById(

        "summaryTotal"

    ).textContent = formatUGX(subtotal);

}
/*=====================================================
INCREASE ITEM
=====================================================*/

function increaseItem(productId){

    increaseQuantity(productId);

    renderCart();

}


/*=====================================================
DECREASE ITEM
=====================================================*/

function decreaseItem(productId){

    decreaseQuantity(productId);

    renderCart();

}


/*=====================================================
DELETE ITEM
=====================================================*/

function deleteItem(productId){

    if(

        !confirm(

            "Remove this coffee from your cart?"

        )

    ){

        return;

    }

    removeProduct(productId);

    renderCart();

}


/*=====================================================
BUILD ORDER
=====================================================*/

function buildOrder(){

    const customer = {

        name:

            document.getElementById(

                "customerName"

            ).value.trim(),

        email:

            document.getElementById(

                "customerEmail"

            ).value.trim(),

        phone:

            document.getElementById(

                "customerPhone"

            ).value.trim(),

        location:

            document.getElementById(

                "deliveryLocation"

            ).value.trim(),

        customerType:

            document.getElementById(

                "customerType"

            ).value,

        preferredContact:

            document.getElementById(

                "preferredContact"

            ).value,

        notes:

            document.getElementById(

                "customerNotes"

            ).value.trim(),

        newsletter:

            document.getElementById(

                "newsletter"

            ).checked

    };

    let totalItems = 0;

    let totalAmount = 0;

    const items = getCurrentCart().map(product=>{

        const lineTotal =

            product.price *

            product.quantity;

        totalItems +=

            product.quantity;

        totalAmount +=

            lineTotal;

        return{

            id: product.id,

            name: product.name,

            process: product.process,

            grade: product.grade,

            unit: product.unit,

            quantity: product.quantity,

            unitPrice: product.price,

            lineTotal: lineTotal

        };

    });

    return{

        orderNumber:

            generateOrderNumber(),

        orderDate:

            new Date().toISOString(),

        currency:"UGX",

        customer:customer,

        items:items,

        totalItems:totalItems,

        totalAmount:totalAmount

    };

}
/*=====================================================
CHECKOUT FORM
=====================================================*/

const checkoutForm =

document.getElementById(

    "checkoutForm"

);

if(checkoutForm){

    checkoutForm.addEventListener(

        "submit",

        submitOrder

    );

}


/*=====================================================
SUBMIT ORDER
=====================================================*/

async function submitOrder(e){

    e.preventDefault();

    if(getCurrentCart().length===0){

        showNotification(

            "Your cart is empty.",

            "warning"

        );

        return;

    }

    const email =

        document.getElementById(

            "customerEmail"

        ).value.trim();

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

        ).value.trim();

    if(!validPhone(phone)){

        showNotification(

            "Please enter a valid phone number.",

            "danger"

        );

        return;

    }

    const submitButton =

        checkoutForm.querySelector(

            "button[type='submit']"

        );

    const originalText =

        submitButton.innerHTML;

    submitButton.disabled = true;

    submitButton.innerHTML =

`

<i class="fas fa-spinner fa-spin"></i>

Sending Order...

`;

    const order = buildOrder();

    try{

        const response = await fetch(

            "/.netlify/functions/order",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(order)

            }

        );

        const result =

            await response.json();

        if(!response.ok){

            throw new Error(

                result.message ||

                "Unable to submit your order."

            );

        }

        showNotification(

            "Order submitted successfully.",

            "success"

        );

        alert(

`Thank you for choosing Tasty Kaawa!

Order Number:

${result.orderNumber}

Your order inquiry has been received.

Our sales team will contact you shortly.`

        );

        clearCart();

        checkoutForm.reset();

        renderCart();

    }

    catch(error){

        console.error(error);

        showNotification(

            error.message,

            "danger"

        );

    }

    finally{

        submitButton.disabled = false;

        submitButton.innerHTML =

            originalText;

    }

}
/*=====================================================
INITIALISE CART
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        updateCartBadge();

        renderCart();

    }

);


/*=====================================================
AUTO REFRESH WHEN STORAGE CHANGES
Useful when multiple tabs are open
=====================================================*/

window.addEventListener(

    "storage",

    ()=>{

        updateCartBadge();

        renderCart();

    }

);


/*=====================================================
REFRESH CART WHEN PAGE BECOMES ACTIVE
=====================================================*/

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(!document.hidden){

            updateCartBadge();

            renderCart();

        }

    }

);