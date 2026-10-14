```javascript
function toggleMenu() {
    const menu = document.getElementById("navMenu");
    if (menu) menu.classList.toggle("show");
}

function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function requireLogin() {
    if (!localStorage.getItem("hpLoggedIn")) {
        location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const account = getData("hpAccount");

            if (account.email === email && account.password === password) {
                localStorage.setItem("hpLoggedIn", "true");
                location.href = "home.html";
            } else {
                alert("Account not found. Please create an account first.");
            }
        });
    }

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("fullname").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;
            const confirm = document.getElementById("confirmPassword").value;

            if (password !== confirm) {
                alert("Passwords do not match.");
                return;
            }

            saveData("hpAccount", { name, email, password });
            alert("Account created. You can now log in.");
            location.href = "index.html";
        });
    }

    const petForm = document.getElementById("petForm");

    if (petForm) {
        petForm.addEventListener("submit", event => {
            event.preventDefault();

            const pets = getData("hpPets");
            pets.push({
                id: Date.now(),
                name: document.getElementById("petName").value.trim(),
                type: document.getElementById("petType").value,
                breed: document.getElementById("petBreed").value.trim(),
                gender: document.getElementById("petGender").value,
                birth: document.getElementById("petBirth").value,
                color: document.getElementById("petColor").value.trim(),
                weight: document.getElementById("petWeight").value,
                notes: document.getElementById("petNotes").value.trim()
            });

            saveData("hpPets", pets);
            alert("Pet information saved.");
            location.href = "pets.html";
        });
    }

    const petList = document.getElementById("petList");

    if (petList) {
        const pets = getData("hpPets");

        petList.innerHTML = pets.length
            ? pets.map(pet => `
                <div class="pet-card">
                    <h3>🐾 ${escapeHTML(pet.name)}</h3>
                    <p>${escapeHTML(pet.type)} · ${escapeHTML(pet.breed)}</p>
                    <p>Gender: ${escapeHTML(pet.gender)}</p>
                    <a class="button-link" href="pet-details.html?id=${pet.id}">View Details</a>
                </div>
            `).join("")
            : `<div class="empty"><h3>No pets registered yet</h3>
               <p>Add your first pet to get started.</p>
               <a class="button-link" href="add-pet.html">Add Pet</a></div>`;
    }

    const petDetails = document.getElementById("petDetails");

    if (petDetails) {
        const id = Number(new URLSearchParams(location.search).get("id"));
        const pet = getData("hpPets").find(item => item.id === id);

        petDetails.innerHTML = pet ? `
            <h2>🐾 ${escapeHTML(pet.name)}</h2>
            <p><b>Type:</b> ${escapeHTML(pet.type)}</p>
            <p><b>Breed:</b> ${escapeHTML(pet.breed)}</p>
            <p><b>Gender:</b> ${escapeHTML(pet.gender)}</p>
            <p><b>Date of Birth:</b> ${escapeHTML(pet.birth)}</p>
            <p><b>Color:</b> ${escapeHTML(pet.color)}</p>
            <p><b>Weight:</b> ${escapeHTML(pet.weight)} kg</p>
            <p><b>Medical Notes:</b> ${escapeHTML(pet.notes)}</p>
            <button class="danger" onclick="deletePet(${pet.id})">Delete Pet</button>
        ` : `<p>Pet not found.</p><a href="pets.html">Back to My Pets</a>`;
    }

    const appointmentForm = document.getElementById("appointmentForm");

    if (appointmentForm) {
        const select = document.getElementById("appointmentPet");

        getData("hpPets").forEach(pet => {
            const option = document.createElement("option");
            option.value = pet.id;
            option.textContent = pet.name;
            select.appendChild(option);
        });

        appointmentForm.addEventListener("submit", event => {
            event.preventDefault();

            const appointments = getData("hpAppointments");
            const pets = getData("hpPets");
            const pet = pets.find(item =>
                item.id === Number(select.value)
            );

            if (!pet) {
                alert("Please add a pet first.");
                return;
            }

            appointments.push({
                id: Date.now(),
                pet: pet.name,
                service: document.getElementById("appointmentService").value,
                date: document.getElementById("appointmentDate").value,
                time: document.getElementById("appointmentTime").value,
                notes: document.getElementById("appointmentNotes").value,
                status: "Pending"
            });

            saveData("hpAppointments", appointments);
            alert("Appointment request saved.");
            location.href = "appointments.html";
        });
    }

    const appointmentList = document.getElementById("appointmentList");

    if (appointmentList) {
        const appointments = getData("hpAppointments");

        appointmentList.innerHTML = appointments.length
            ? `<div class="table-wrap"><table>
                <tr><th>Pet</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th></tr>
                ${appointments.map(item => `
                    <tr>
                    <td>${escapeHTML(item.pet)}</td>
                    <td>${escapeHTML(item.service)}</td>
                    <td>${escapeHTML(item.date)}</td>
                    <td>${escapeHTML(item.time)}</td>
                    <td><span class="status">${escapeHTML(item.status)}</span></td>
                    </tr>
                `).join("")}
                </table></div>`
            : `<div class="empty"><p>No appointments yet.</p>
               <a class="button-link" href="book-appointment.html">Book Appointment</a></div>`;
    }

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (profileName && profileEmail) {
        const account = getData("hpAccount");
        profileName.value = account.name || "";
        profileEmail.value = account.email || "";
    }

    const profileForm = document.getElementById("profileForm");

    if (profileForm) {
        profileForm.addEventListener("submit", event => {
            event.preventDefault();
            const account = getData("hpAccount");
            account.name = profileName.value.trim();
            saveData("hpAccount", account);
            alert("Profile updated.");
        });
    }

    const consultationForm = document.getElementById("consultationForm");

    if (consultationForm) {
        consultationForm.addEventListener("submit", event => {
            event.preventDefault();
            const consultations = getData("hpConsultations");

            consultations.push({
                id: Date.now(),
                pet: document.getElementById("consultPet").value,
                concern: document.getElementById("consultConcern").value,
                date: new Date().toLocaleDateString()
            });

            saveData("hpConsultations", consultations);
            alert("Consultation request saved.");
            consultationForm.reset();
        });
    }

    const consultationList = document.getElementById("consultationList");

    if (consultationList) {
        consultationList.innerHTML = getData("hpConsultations").map(item => `
            <div class="pet-card">
                <h3>${escapeHTML(item.pet)}</h3>
                <p>${escapeHTML(item.concern)}</p>
                <p>${escapeHTML(item.date)}</p>
            </div>
        `).join("") || "<p>No consultation requests yet.</p>";
    }

    const notificationList = document.getElementById("notificationList");

    if (notificationList) {
        const appointments = getData("hpAppointments");

        notificationList.innerHTML = appointments.map(item => `
            <div class="pet-card">
                <h3>📅 Appointment Request</h3>
                <p>${escapeHTML(item.pet)} — ${escapeHTML(item.service)}</p>
                <p>${escapeHTML(item.date)} at ${escapeHTML(item.time)}</p>
                <span class="status">${escapeHTML(item.status)}</span>
            </div>
        `).join("") || "<p>No notifications yet.</p>";
    }

    const healthPet = document.getElementById("healthPet");

    if (healthPet) {
        healthPet.innerHTML = getData("hpPets").map(pet => `
            <div class="pet-card">
                <h3>🐾 ${escapeHTML(pet.name)}</h3>
                <p>${escapeHTML(pet.notes || "No medical notes recorded.")}</p>
                <p>Breed: ${escapeHTML(pet.breed)}</p>
            </div>
        `).join("") || "<p>Add a pet to view health records.</p>";
    }

    document.querySelectorAll("[data-logout]").forEach(button => {
        button.addEventListener("click", () => {
            localStorage.removeItem("hpLoggedIn");
            location.href = "index.html";
        });
    });
});

function deletePet(id) {
    if (!confirm("Delete this pet?")) return;

    saveData("hpPets", getData("hpPets").filter(pet => pet.id !== id));
    location.href = "pets.html";
}
```
