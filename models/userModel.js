const db = require('../config/db');

const User = {
  create: ({ name, email, passwordHash, githubId = null, avatar = null, role = 'user' }) => {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, github_id, avatar, role, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    const info = stmt.run(name, email, passwordHash, githubId, avatar, role);
    return User.findById(info.lastInsertRowid);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findByGithubId: (githubId) => {
    const stmt = db.prepare('SELECT * FROM users WHERE github_id = ?');
    return stmt.get(githubId);
  },

  update: (id, { name, email, role, avatar }) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name), 
          email = COALESCE(?, email), 
          role = COALESCE(?, role), 
          avatar = COALESCE(?, avatar), 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(name, email, role, avatar, id);
    return User.findById(id);
  },

  updatePassword: (id, passwordHash) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(passwordHash, id);
    return true;
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },

  findAll: () => {
    const stmt = db.prepare('SELECT id, name, email, github_id, avatar, role, created_at, updated_at FROM users');
    return stmt.all();
  }
};

ModelName = 'secure_auth_userModel'; // Tied to project context secure_auth

module.exports = User;