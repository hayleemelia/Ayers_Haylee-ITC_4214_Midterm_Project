let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

//render reservations when page loads
renderReservations();

//reservation form submission
document.querySelector("reservationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let newReservation = {
        id: Date.now(),
        name: document.querySelector("resName").value,
        notes: document.querySelector("resNotes").value,
        date: document.querySelector("resDate").value,
        status: "Pending",
        priority: document.querySelector("resPriority").value
    };

    reservations.push(newReservation);
    saveReservations();
    renderReservations();
    this.reset();
});

//add reservations to table
function renderReservations() {
    let tbody = document.querySelector("#reservationTable tbody");
    tbody.innerHTML = "";

    reservations.forEach(res => {
        let row = `
            <tr>
                <td>${res.name}</td>
                <td>${res.notes}</td>
                <td>${res.date}</td>
                <td>${res.status}</td>
                <td class="${res.priority.toLowerCase()}">${res.priority}</td>
                <td>
                    <button onclick="markCompleted(${res.id})">Complete</button>
                    <button onclick="deleteReservation(${res.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    updateSummary();
}

//save reservations
function saveReservations() {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

//delete reservations
function deleteReservation(id) {
    reservations = reservations.filter(res => res.id !== id);
    saveReservations();
    renderReservations();
}

//mark as complete
function markCompleted(id) {
    let reservation = reservations.find(res => res.id === id);
    reservation.status = "Completed";
    saveReservations();
    renderReservations();
}

//update reservation summary
function updateSummary() {
    let total = reservations.length;
    let completed = reservations.filter(r => r.status === "Completed").length;
    let pending = total - completed;

    document.querySelector("totalCount").textContent = total;
    document.querySelector("pendingCount").textContent = pending;
    document.querySelector("completedCount").textContent = completed;
}

//filtering
function filterReservations(status) {
    let filtered = status === "All"
        ? reservations
        : reservations.filter(r => r.status === status);

    renderFiltered(filtered);
}

//sorting
function sortByDate() {
    reservations.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderReservations();
}

//reservation analytics
new Chart(document.querySelector("statusChart"), {
    type: 'bar',
    data: {
        labels: ['Pending', 'Completed'],
        datasets: [{
            label: 'Reservations',
            data: [pendingCount, completedCount]
        }]
    }
});


