/*=========================================================
    TASTY KAAWA
    MAIN JAVASCRIPT
=========================================================*/

"use strict";

/*=========================================================
    DOCUMENT READY
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    initNavbar();

    initScrollAnimations();

    initBackToTop();

    initSmoothScroll();

    initCounters();

    initActiveNavigation();

    initCookieBanner();

    initCurrentYear();

    initProductSearch();

    initTooltips();

});



/*=========================================================
    STICKY NAVBAR
=========================================================*/

function initNavbar() {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });

}



/*=========================================================
    BACK TO TOP
=========================================================*/

function initBackToTop() {

    const button = document.querySelector(".back-top");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });

    button.addEventListener("click", function (e) {

        e.preventDefault();

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}



/*=========================================================
    SMOOTH SCROLL
=========================================================*/

function initSmoothScroll(){

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            const target=document.querySelector(this.getAttribute("href"));

            if(target){

                e.preventDefault();

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

}



/*=========================================================
    SCROLL ANIMATIONS
=========================================================*/

function initScrollAnimations(){

    const items=document.querySelectorAll(

        ".fade-up,.fade-left,.fade-right,.zoom-in"

    );

    if(items.length===0) return;

    const observer=new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:.15

    });

    items.forEach(item=>{

        observer.observe(item);

    });

}



/*=========================================================
    ACTIVE NAVIGATION
=========================================================*/

function initActiveNavigation(){

    const current=window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar .nav-link")

    .forEach(link=>{

        const href=link.getAttribute("href");

        if(href===current){

            link.classList.add("active");

        }

    });

}



/*=========================================================
    COUNTER ANIMATION
=========================================================*/

function initCounters(){

    const counters=document.querySelectorAll(".counter");

    if(counters.length===0) return;

    counters.forEach(counter=>{

        const target=Number(counter.dataset.target);

        let current=0;

        const increment=target/100;

        const timer=setInterval(()=>{

            current+=increment;

            if(current>=target){

                counter.innerText=target;

                clearInterval(timer);

            }

            else{

                counter.innerText=Math.floor(current);

            }

        },20);

    });

}



/*=========================================================
    COOKIE BANNER
=========================================================*/

function initCookieBanner(){

    const banner=document.querySelector(".cookie-banner");

    const accept=document.querySelector("#acceptCookies");

    if(!banner) return;

    if(localStorage.getItem("cookiesAccepted")){

        banner.style.display="none";

        return;

    }

    banner.style.display="block";

    if(accept){

        accept.addEventListener("click",()=>{

            localStorage.setItem("cookiesAccepted","yes");

            banner.style.display="none";

        });

    }

}



/*=========================================================
    CURRENT YEAR
=========================================================*/

function initCurrentYear(){

    const year=document.querySelector("#year");

    if(year){

        year.innerHTML=new Date().getFullYear();

    }

}



/*=========================================================
    PRODUCT SEARCH
=========================================================*/

function initProductSearch(){

    const input=document.querySelector("#searchProduct");

    if(!input) return;

    input.addEventListener("keyup",()=>{

        const value=input.value.toLowerCase();

        document.querySelectorAll(".product-card")

        .forEach(card=>{

            const text=card.innerText.toLowerCase();

            card.parentElement.style.display=

                text.includes(value)

                ?"block"

                :"none";

        });

    });

}



/*=========================================================
    TOOLTIPS
=========================================================*/

function initTooltips(){

    const tooltipTriggerList=[].slice.call(

        document.querySelectorAll('[data-bs-toggle="tooltip"]')

    );

    tooltipTriggerList.map(function(element){

        return new bootstrap.Tooltip(element);

    });

}



/*=========================================================
    FORMAT NUMBER
=========================================================*/

function formatNumber(number){

    return new Intl.NumberFormat().format(number);

}



/*=========================================================
    FORMAT CURRENCY
=========================================================*/

function formatCurrency(amount){

    return "UGX " +

    new Intl.NumberFormat().format(amount);

}



/*=========================================================
    NOTIFICATION
=========================================================*/

function showNotification(message,type="success"){

    const notification=document.createElement("div");

    notification.className=

    `alert alert-${type}`;

    notification.style.position="fixed";

    notification.style.top="20px";

    notification.style.right="20px";

    notification.style.zIndex="9999";

    notification.style.minWidth="280px";

    notification.innerHTML=message;

    document.body.appendChild(notification);

    setTimeout(()=>{

        notification.remove();

    },3000);

}



/*=========================================================
    PRELOADER
=========================================================*/

window.addEventListener("load",()=>{

    const loader=document.querySelector(".loader-wrapper");

    if(loader){

        loader.style.opacity="0";

        setTimeout(()=>{

            loader.style.display="none";

        },500);

    }

});



/*=========================================================
    IMAGE LAZY LOAD
=========================================================*/

const lazyImages=document.querySelectorAll("img[data-src]");

if(lazyImages.length){

    const imageObserver=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                const img=entry.target;

                img.src=img.dataset.src;

                img.removeAttribute("data-src");

                imageObserver.unobserve(img);

            }

        });

    });

    lazyImages.forEach(img=>{

        imageObserver.observe(img);

    });

}



/*=========================================================
    COPY EMAIL
=========================================================*/

function copyEmail(){

    navigator.clipboard.writeText(

        "tastykaawa@gmail.com"

    );

    showNotification(

        "Email copied successfully!"

    );

}



/*=========================================================
    OPEN WHATSAPP
=========================================================*/

function openWhatsApp(){

    window.open(

        "https://wa.me/256772093578",

        "_blank"

    );

}



/*=========================================================
    DEBOUNCE
=========================================================*/

function debounce(func,delay){

    let timer;

    return function(){

        clearTimeout(timer);

        timer=setTimeout(()=>{

            func.apply(this,arguments);

        },delay);

    };

}



/*=========================================================
    SCROLL TO ELEMENT
=========================================================*/

function scrollToSection(id){

    const section=document.getElementById(id);

    if(section){

        section.scrollIntoView({

            behavior:"smooth"

        });

    }

}



/*=========================================================
    CONSOLE MESSAGE
=========================================================*/

console.log(

"%c☕ Welcome to Tasty Kaawa",

"color:#C8A96E;font-size:18px;font-weight:bold;"

);

console.log(

"Website Developed using HTML5, CSS3, Bootstrap & JavaScript."

);