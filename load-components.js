$(document).ready(function() {

    $("#nav-placeholder").load("navbar.html", function() {
        const $logo = $("#nav-logo");
        const $navLinks = $(".nav-links");

        $logo.on("click", function() {
            $navLinks.toggleClass("active"); // toggle the menu
        });
    });

    $("#footer-placeholder").load("footer.html");
});
