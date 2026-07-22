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
  const usersTableBody = document.getElementById('usersTableBody');
  const logoutBtn = document.getElementById('logoutBtn');

  const showAlert = (message, type = 'error') => {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/admin/users');
      if (res.status === 403 || res.status === 401) {
        alert('Access denied. Admins only.');
        window.location.href = '/views/dashboard.html';
        return;
      }
      const data = await res.json();
      const users = data.users;

      if (users.length === 0) {
        usersTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No users found.</td></tr>`;
        return;
      }

      usersTableBody.innerHTML = users.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email || 'GitHub Account'}</td>
          <td><span class="user-badge" style="font-size: 10px;">${user.role}</span></td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
          <td>
            ${user.role !== 'admin' ? `<button class="btn-danger" onclick="deleteUser(${user.id})">Delete</button>` : '<span style="color:var(--text-muted);font-size:12px;">Protected</span>'}
          </td>
        </tr>
      `).join('');
    } catch (err) {
      showAlert('Failed to load users list.');
    }
  };

  window.deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        showAlert('User deleted successfully.', 'success');
        loadUsers();
      } else {
        showAlert(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      showAlert('Network error occurred.');
    }
  };

  logoutBtn.addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/views/login.html';
  });

  loadUsers();
});