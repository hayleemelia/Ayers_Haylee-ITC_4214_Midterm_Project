// Load from localStorage or create empty array
let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

// DOM elements
const form = document.querySelector(".reservation-form");
const tableBody = document.querySelector(".reservation-table-body");
const timeSelect = document.querySelector(".time-select");
const dateInput = document.querySelector(".date-input");

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

    reservations.forEach((reservation, index) => {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${reservation.name}</td>
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
                <td><input type="text" value="${reservation.name}" class="edit-name"></td>
                <td><input type="number" value="${reservation.people}" class="edit-people"></td>
                <td><input type="date" value="${reservation.date}" class="edit-date"></td>
                <td><input type="time" value="${reservation.time}" class="edit-time"></td>
                <td>
                    <label>
                        <input type="checkbox" class="edit-status">
                        Completed
                    </label>
                </td>
                <td>
                    <button class="save-btn btn btn-sm btn-success">Save</button>
                    <button class="delete-btn btn btn-sm btn-danger">Cancel</button>
                </td>
            `;

            // ----------------------------
            // Save Button
            // ----------------------------
            row.querySelector(".save-btn").addEventListener("click", () => {

                reservation.name = row.querySelector(".edit-name").value;
                reservation.people = row.querySelector(".edit-people").value;
                reservation.date = row.querySelector(".edit-date").value;
                reservation.time = row.querySelector(".edit-time").value;

                const checked = row.querySelector(".edit-status").checked;
                reservation.status = checked ? "Completed" : "Pending";

                saveReservations();
                renderTable();
            });

            // Delete still available in edit mode
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
