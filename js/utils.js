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

    return JSON.parse(

        localStorage.getItem("tastyCart")

    ) || [];

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
UPDATE CART BADGE
=====================================================*/

function updateCartBadge(){

    const badge = document.getElementById("cartCount");

    if(!badge) return;

    const cart = loadCart();

    let total = 0;

    cart.forEach(item=>{

        total += item.quantity;

    });

    badge.textContent = total;

}


/*=====================================================
GET PRODUCT
=====================================================*/

function getProduct(id){

    return PRODUCTS.find(product=>{

        return product.id===id;

    });

}


/*=====================================================
GET PRODUCT INDEX
=====================================================*/

function getCartIndex(cart,id){

    return cart.findIndex(item=>{

        return item.id===id;

    });

}


/*=====================================================
SHOW NOTIFICATION
=====================================================*/

function showNotification(message,type="success"){

    const alert=document.createElement("div");

    alert.className=

    `alert alert-${type} shadow-lg position-fixed`;

    alert.style.top="100px";

    alert.style.right="25px";

    alert.style.minWidth="320px";

    alert.style.zIndex="99999";

    alert.style.borderRadius="12px";

    alert.innerHTML=`

<i class="fas fa-check-circle me-2"></i>

${message}

`;

    document.body.appendChild(alert);

    setTimeout(()=>{

        alert.classList.add("opacity-75");

    },2200);

    setTimeout(()=>{

        alert.remove();

    },2800);

}


/*=====================================================
ORDER NUMBER
=====================================================*/

function generateOrderNumber(){

    const now=new Date();

    const year=now.getFullYear();

    const month=String(

        now.getMonth()+1

    ).padStart(2,"0");

    const day=String(

        now.getDate()

    ).padStart(2,"0");

    const random=Math.floor(

        Math.random()*9000

    )+1000;

    return `TK-${year}${month}${day}-${random}`;

}


/*=====================================================
FORMAT DATE
=====================================================*/

function formatDate(date){

    return new Date(date)

    .toLocaleDateString(

        "en-UG",

        {

            day:"numeric",

            month:"long",

            year:"numeric"

        }

    );

}


/*=====================================================
EMAIL VALIDATION
=====================================================*/

function validEmail(email){

    const regex=

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);

}


/*=====================================================
PHONE VALIDATION
=====================================================*/

function validPhone(phone){

    const regex=

    /^[0-9+\-\s]{9,15}$/;

    return regex.test(phone);

}