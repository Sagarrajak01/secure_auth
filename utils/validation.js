const validator = {
  isValidEmail: (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  isValidPassword: (password) => {
    // Minimum 8 characters, at least one letter and one number
    if (!password || typeof password !== 'string') return false;
    return password.length >= 8;
  },

  sanitizeString: (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g, (tag) => {
      const chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return chars[tag] || tag;
    }).trim();
  }
};

module.exports = validator;