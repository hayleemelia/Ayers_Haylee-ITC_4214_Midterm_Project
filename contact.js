document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.querySelector("#contact-form");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent real submission

        // Get input values using querySelector
        const name = document.querySelector("#full-name").value;
        const email = document.querySelector("#email").value;
        const phone = document.querySelector("#phone").value;
        const message = document.querySelector("#message").value;

        // Build confirmation message
        const confirmationMessage = `
            Confirmed! Your message has been sent.
            
            Here are the details you submitted:
            
            Full Name: ${name}
            Email: ${email}
            Phone Number: ${phone}
            Message:
            ${message}
                    `;

        alert(confirmationMessage);

        // Reset form
        contactForm.reset();
    });

});

document.addEventListener("DOMContentLoaded", function () {

    const newsletterForm = document.querySelector("#newsletter-form");

    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent real submission

        const email = newsletterForm.querySelector("#newsletter-email").value;

        const selectedLanguage = newsletterForm.querySelector("input[name='lang-opt']:checked").value;

        const confirmationMessage = `
            Confirmed! You have successfully signed up for our newsletter.
            
            Here are your subscription details:
            
            Email: ${email}
            Language Preference: ${selectedLanguage}
                    `;

        alert(confirmationMessage);

        newsletterForm.reset();
    });

});

