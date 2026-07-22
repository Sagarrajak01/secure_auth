document.addEventListener('DOMContentLoaded', () => {
  // Theme Initializer & Toggle Handler
  const currentTheme = localStorage.getItem('secure_auth_theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('secure_auth_theme', isLight ? 'light' : 'dark');
    });
  }

  // Persistent Auth Check: If already logged in, skip login/register and jump straight to dashboard
  fetch('/auth/profile')
    .then(res => {
      if (res.ok) {
        window.location.href = '/views/dashboard.html';
      }
    })
    .catch(() => {});

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const alertBox = document.getElementById('alertBox');

  const showAlert = (message, type = 'error') => {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe').checked;

      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, rememberMe })
        });
        const data = await res.json();

        if (res.ok) {
          showAlert('Login successful! Redirecting...', 'success');
          setTimeout(() => { window.location.href = '/views/dashboard.html'; }, 1000);
        } else {
          showAlert(data.error || 'Login failed.');
        }
      } catch (err) {
        showAlert('Network error occurred.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (res.ok) {
          showAlert('Registration successful! Redirecting to login...', 'success');
          setTimeout(() => { window.location.href = '/views/login.html'; }, 1200);
        } else {
          showAlert(data.error || 'Registration failed.');
        }
      } catch (err) {
        showAlert('Network error occurred.');
      }
    });
  }
});