async function getCatFact() {
    try {
        const response = await fetch("https://catfact.ninja/fact");
        const data = await response.json();

        document.querySelector("#cat-fact").textContent = data.fact;
    } catch (error) {
        document.querySelector("#cat-fact").textContent =
            "Oops! Couldn't load a cat fact right now.";
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", function () {
    getCatFact();
});
