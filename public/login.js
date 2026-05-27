document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");
  const togglePassword = document.getElementById("togglePassword");

  togglePassword.addEventListener("change", () => {
    passwordInput.type = togglePassword.checked ? "text" : "password";
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("userCode", data.userCode);

        window.location.href = "index.html";
      } else {
        errorMessage.textContent =
          data.message || "Invalid username or password.";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorMessage.textContent =
        "An error occurred. Please try again.";
    }
  });
});
