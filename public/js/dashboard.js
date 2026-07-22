document.addEventListener('DOMContentLoaded', async () => {
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

  const alertBox = document.getElementById('alertBox');
  const welcomeText = document.getElementById('welcomeText');
  const roleBadge = document.getElementById('roleBadge');
  const adminBtn = document.getElementById('adminBtn');
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileJoined = document.getElementById('profileJoined');
  const logoutBtn = document.getElementById('logoutBtn');
  const passwordForm = document.getElementById('passwordForm');

  const showAlert = (message, type = 'error') => {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  };

  try {
    const res = await fetch('/auth/profile');
    if (!res.ok) {
      window.location.href = '/views/login.html';
      return;
    }
    const data = await res.json();
    const user = data.user;

    welcomeText.textContent = `Welcome back, ${user.name}!`;
    roleBadge.textContent = user.role;
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    profileJoined.textContent = new Date(user.created_at).toLocaleDateString();

    if (user.role === 'admin') {
      adminBtn.style.display = 'block';
    }
  } catch (err) {
    window.location.href = '/views/login.html';
  }

  logoutBtn.addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/views/login.html';
  });

  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
      const res = await fetch('/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        showAlert('Password changed successfully!', 'success');
        passwordForm.reset();
      } else {
        showAlert(data.error || 'Failed to change password.');
      }
    } catch (err) {
      showAlert('Network error occurred.');
    }
  });
});