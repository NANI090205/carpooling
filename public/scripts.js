const apiBase = "http://localhost:4000/api";

// SIGNUP
async function signupUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${apiBase}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (data.success) {
        alert("Signup successful! Please log in.");
        window.location.href = "/login";
    } else {
        alert(data.message);
    }
}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (res.ok) {
        window.location.href = "login.html";
      } else {
        const data = await res.json();
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  });
  

// LOGIN
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${apiBase}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
    } else {
        alert(data.message);
    }
}

// LOGOUT
function logoutUser() {
    localStorage.removeItem("user");
    window.location.href = "/login";
}

// DISPLAY UNIQUE CODE ON PAGES
function showUserCode() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("uniqueCode").textContent = `Your Unique Code: ${user.uniqueCode}`;
    }
}

// PUBLISH RIDE
async function publishRide(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("You must be logged in.");

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const seats = document.getElementById("seats").value;

    const res = await fetch(`${apiBase}/rides/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            uniqueCode: user.uniqueCode,
            source,
            destination,
            date,
            time,
            seats
        })
    });

    const data = await res.json();
    if (data.success) {
        window.location.href = "/dashboard";
    } else {
        alert(data.message);
    }
}

// SHOW DASHBOARD RIDES
async function loadDashboardRides() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Not authorized");

    const res = await fetch(`${apiBase}/rides/user/${user.uniqueCode}`);
    const data = await res.json();

    const container = document.getElementById("rideList");
    container.innerHTML = "";

    if (data.rides.length === 0) {
        container.innerHTML = "<p>No rides published.</p>";
        return;
    }

    data.rides.forEach((ride) => {
        const div = document.createElement("div");
        div.className = "ride-card";
        div.innerHTML = `
            <p><strong>From:</strong> ${ride.source}</p>
            <p><strong>To:</strong> ${ride.destination}</p>
            <p><strong>Date:</strong> ${ride.date}</p>
            <p><strong>Time:</strong> ${ride.time}</p>
            <p><strong>Seats:</strong> ${ride.seatsAvailable}</p>
        `;
        container.appendChild(div);
    });
}
if (res.ok) {
    localStorage.setItem("username", data.username);   // Optional
    localStorage.setItem("uniqueCode", data.code);     // Save the unique 5-digit code
    window.location.href = "index.html";
  }
  window.addEventListener("DOMContentLoaded", () => {
    const code = localStorage.getItem("uniqueCode");
    if (code) {
      document.getElementById("uniqueCodeDisplay").innerText = code;
    }
  });
  