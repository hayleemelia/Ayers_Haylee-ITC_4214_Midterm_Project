// Load from localStorage or create empty array
let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

// DOM elements
const form = document.querySelector(".reservation-form");
const tableBody = document.querySelector(".reservation-table-body");
const timeSelect = document.querySelector(".time-select");
const dateInput = document.querySelector(".date-input");
const sortSelect = document.querySelector(".sort-select");
const filterSelect = document.querySelector(".filter-select");


// ----------------------------
// Generate time slots
// ----------------------------
function generateTimeSlots() {
    for (let hour = 12; hour <= 19; hour++) {
        for (let min = 0; min < 60; min += 30) {
            if (hour === 19 && min > 30) break;

            let h = hour.toString().padStart(2, "0");
            let m = min.toString().padStart(2, "0");

            let option = document.createElement("option");
            option.value = `${h}:${m}`;
            option.textContent = `${h}:${m}`;

            timeSelect.appendChild(option);
        }
    }
}

generateTimeSlots();

// ----------------------------
// Prevent past dates
// ----------------------------
const today = new Date().toISOString().split("T")[0];
dateInput.min = today;

// ----------------------------
// Save to localStorage
// ----------------------------
function saveReservations() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

// ----------------------------
// Render Table
// ----------------------------
function renderTable() {
    tableBody.innerHTML = "";

    let displayedReservations = [...reservations];

    // ----------------------------
    // FILTERING
    // ----------------------------
    if (filterSelect && filterSelect.value !== "all") {
        displayedReservations = displayedReservations.filter(res =>
            res.status === filterSelect.value
        );
    }

    // ----------------------------
    // SORTING
    // ----------------------------
    if (sortSelect) {
        if (sortSelect.value === "name") {
            displayedReservations.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortSelect.value === "date") {
            displayedReservations.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    }

    // ----------------------------
    // RENDERING ROWS
    // ----------------------------
    displayedReservations.forEach((reservation, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td><div class="name-scroll">${reservation.name}</div></td>
            <td>${reservation.people}</td>
            <td>${reservation.date}</td>
            <td>${reservation.time}</td>
            <td>${reservation.status}</td>
            <td>
                <button class="edit-btn btn btn-sm btn-primary">Edit</button>
                <button class="delete-btn btn btn-sm btn-danger">Cancel</button>
            </td>
        `;

        // ----------------------------
        // Edit Button
        // ----------------------------
        row.querySelector(".edit-btn").addEventListener("click", () => {
            const emailVerify = prompt("Enter your email to edit this reservation:");
            if (emailVerify !== reservation.email) {
                alert("Email does not match this booking.");
                return;
            }

            row.innerHTML = `
                <td><input type="text" value="${reservation.name}" class="edit-name form-control"></td>
                <td><input type="number" value="${reservation.people}" class="edit-people form-control"></td>
                <td><input type="date" value="${reservation.date}" class="edit-date form-control"></td>
                <td><input type="time" value="${reservation.time}" class="edit-time form-control"></td>
                <td>
                    <label>
                        <input type="checkbox" class="edit-status" ${reservation.status === "Completed" ? "checked" : ""}>
                        Completed
                    </label>
                </td>
                <td>
                    <button class="save-btn btn btn-sm btn-success">Save</button>
                    <button class="delete-btn btn btn-sm btn-danger">Cancel</button>
                </td>
            `;

            // Save Button
            row.querySelector(".save-btn").addEventListener("click", () => {
                reservation.name = row.querySelector(".edit-name").value;
                reservation.people = row.querySelector(".edit-people").value;
                reservation.date = row.querySelector(".edit-date").value;
                reservation.time = row.querySelector(".edit-time").value;
                reservation.status = row.querySelector(".edit-status").checked ? "Completed" : "Pending";

                saveReservations();
                renderTable();
            });

            // Delete Button inside edit mode
            row.querySelector(".delete-btn").addEventListener("click", () => {
                deleteReservation(index, reservation);
            });
        });

        // ----------------------------
        // Cancel Button
        // ----------------------------
        row.querySelector(".delete-btn").addEventListener("click", () => {
            deleteReservation(index, reservation);
        });

        tableBody.appendChild(row);
    });
}


// ----------------------------
// Delete Function
// ----------------------------
function deleteReservation(index, reservation) {

    const emailVerify = prompt("Enter your email to cancel this reservation:");
    if (emailVerify !== reservation.email) {
        alert("Email does not match this booking.");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to cancel this booking? This cannot be undone."
    );

    if (confirmDelete) {
        reservations.splice(index, 1);
        saveReservations();
        renderTable();
    }
}

// ----------------------------
// Form Submit
// ----------------------------
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector(".name-input").value;
    const email = form.querySelector(".email-input").value;
    const people = form.querySelector(".people-input").value;
    const date = form.querySelector(".date-input").value;
    const time = form.querySelector(".time-select").value;

    const newReservation = {
        name,
        email,
        people,
        date,
        time,
        status: "Pending"
    };

    reservations.push(newReservation);
    saveReservations();
    renderTable();
    form.reset();
});

renderTable();

sortSelect.addEventListener("change", renderTable);
filterSelect.addEventListener("change", renderTable);

document.addEventListener("DOMContentLoaded", () => {
    function updateAnalytics() {
        const completedCount = reservations.filter(r => r.status === "Completed").length;
        const pendingCount = reservations.filter(r => r.status === "Pending").length;
        const totalCount = reservations.length;

        document.querySelector("#totalReservations").textContent = totalCount;
        document.querySelector("#completedReservations").textContent = completedCount;
        document.querySelector("#pendingReservations").textContent = pendingCount;

        const ctx = document.querySelector("#reservationChart").getContext("2d");

        // Destroy previous chart if it exists
        if (window.reservationChartInstance) {
            window.reservationChartInstance.destroy();
        }

        window.reservationChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Pending", "Completed"],
                datasets: [{
                    label: "Reservations",
                    data: [pendingCount, completedCount],
                    backgroundColor: ["#f39c12", "#2ecc71"]
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, stepSize: 1 } }
            }
        });
    }

    // Call once to render the initial chart
    updateAnalytics();

    // Call this again whenever reservations are added, edited, or deleted
    window.updateAnalytics = updateAnalytics;
});
