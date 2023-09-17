document.addEventListener("DOMContentLoaded", function() {
  // Freight Form Handling
  const freightForm = document.getElementById('freightForm');
  if (freightForm) {
    freightForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Freight Form submitted");  // Added this line

      const distance = document.getElementById('distance').value;
      const weight = document.getElementById('weight').value;
      const typeOfGoods = document.getElementById('typeOfGoods').value;

      fetch('http://localhost:3000/api/calculateFreight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ distance, weight, typeOfGoods }),
      })
      .then(response => {
        console.log("Response received:", response);  // Added this line
        return response.json();
      })
      .then(data => {
        console.log("Data received:", data);  // Added this line
        alert(`The freight cost is: ${data.freightCost}`);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
    });  // Missing closing brace and parenthesis were added here
  }

  // Login Form Handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Login Form submitted");  // Added this line

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => {
        if (response.redirected) {
          window.location.href = response.url;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }

  // Registration Form Handling
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("Registration Form submitted");  // Added this line

      const newUsername = document.getElementById('newUsername').value;
      const newPassword = document.getElementById('newPassword').value;
      
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newUsername, newPassword }),
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    });
  }
});
