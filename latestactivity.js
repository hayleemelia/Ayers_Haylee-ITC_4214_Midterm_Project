document.addEventListener("DOMContentLoaded", () => {

    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    const completedCount = reservations.filter(r => r.status === "Completed").length;
    const pendingCount = reservations.filter(r => r.status === "Pending").length;
    const totalCount = reservations.length;

    const totalEl = document.querySelector("#totalReservations");
    const completedEl = document.querySelector("#completedReservations");
    const pendingEl = document.querySelector("#pendingReservations");

    if (totalEl) totalEl.textContent = totalCount;
    if (completedEl) completedEl.textContent = completedCount;
    if (pendingEl) pendingEl.textContent = pendingCount;
});
