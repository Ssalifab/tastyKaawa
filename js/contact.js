/* ==========================================
   TASTY KAAWA CONTACT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", submitContactForm);

});

/* ==========================================
   VALIDATION
========================================== */

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function validatePhone(phone) {

    if (phone.trim() === "") return true;

    return /^[+0-9\s()-]{7,20}$/.test(phone);

}

/* ==========================================
   BUTTON STATE
========================================== */

function setButtonLoading(button, loading) {

    if (loading) {

        button.disabled = true;

        button.dataset.originalText = button.innerHTML;

        button.innerHTML = `

        <span class="spinner-border spinner-border-sm me-2"></span>

        Sending...

        `;

    } else {

        button.disabled = false;

        button.innerHTML = button.dataset.originalText;

    }

}

/* ==========================================
   SUBMIT CONTACT FORM
========================================== */

async function submitContactForm(e) {

    e.preventDefault();

    const form = e.target;

    const button = form.querySelector("button[type='submit']");

    const name =
        form.querySelector("input[type='text']").value.trim();

    const email =
        form.querySelector("input[type='email']").value.trim();

    const phone =
        form.querySelector("input[type='tel']").value.trim();

    const subject =
        form.querySelector("select").value;

    const message =
        form.querySelector("textarea").value.trim();
            if (name === "") {

        showNotification("Please enter your name.");

        return;

    }

    if (!validateEmail(email)) {

        showNotification("Please enter a valid email address.");

        return;

    }

    if (!validatePhone(phone)) {

        showNotification("Please enter a valid phone number.");

        return;

    }

    if (message === "") {

        showNotification("Please enter your message.");

        return;

    }

    setButtonLoading(button, true);
        try {

        await new Promise(resolve => setTimeout(resolve, 1200));

        console.log({

            name,

            email,

            phone,

            subject,

            message

        });

        showNotification(

            "Thank you! Your message has been sent."

        );

        form.reset();

    } catch (error) {

        console.error(error);

        showNotification(

            "Something went wrong. Please try again."

        );

    } finally {

        setButtonLoading(button, false);

    }

}