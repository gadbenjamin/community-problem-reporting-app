function goToLogin() {
  window.location.href = "login.html";
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    alert('Login failed, try again later');
  }
}

// call this on a registration page
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Please enter a username and password");
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      alert('Registration successful! You can now log in.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (err) {
    console.error(err);
    alert('Registration failed, try again later');
  }
}

function logout() {
  window.location.href = "index.html";
}

function goToReport() {
  window.location.href = "report.html";
}

function goToDashboard() {
  window.location.href = "dashboard.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reportForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const problem = document.getElementById("problemType").value;
      const description = document.getElementById("description").value;

      const reportList = document.getElementById("reportList");

      const reportDiv = document.createElement("div");
      reportDiv.className = "report";

      reportDiv.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Problem:</strong> ${problem}<br>
        <strong>Description:</strong> ${description}
      `;

      reportList.appendChild(reportDiv);
      this.reset();
    });
  }
});