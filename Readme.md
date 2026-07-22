# Secure Auth

A secure, modern full-stack Authentication & Authorization system built with Node.js, Express, and SQLite. Features a glassmorphic design, Role-Based Access Control (RBAC).

---


### Authentication & Security

* **Local Credentials:** Secure user registration and login backed by `bcrypt` password hashing.
* **HttpOnly JWT Cookies:** Tokens are stored securely to protect against Cross-Site Scripting (XSS).
* **Persistent Sessions & Explicit Logout:** Active sessions persist smoothly across browser reloads. Logged-in users are automatically routed to the dashboard, and logging out clears session credentials completely.
* **Remember Me Option:** Flexible token expiration periods (1 day standard vs. 7 days with "Remember Me").
* **GitHub OAuth:** Integrated third-party login via Passport.js.
* **Input Sanitization & Protection:** Parameterized SQLite queries safeguard against SQL injections.

### Authorization (RBAC)

* **Role-Based Access Control:** Strict permission segregation between standard `user` and elevated `admin` privileges.
* **Auto-Admin Assignment:** The very first registered account in the system database automatically acquires administrator rights.

### User Interface & Experience

* **SaaS Glassmorphism Design:** Modern styling utilizing CSS variables, soft shadows, and smooth layout grids.
* **Dynamic Theme Switcher:** Fully integrated Light and Dark mode options with state retention via `localStorage`.

---

## Tech Stack

* **Runtime Environment:** [Node.js](https://nodejs.org/)
* **Web Framework:** [Express.js](https://expressjs.com/)
* **Database:** SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `passport.js`
* **Frontend:** HTML5, CSS3, Vanilla JavaScript

---

## Project Structure

```text
secure_auth/
├── app.js               # Application entry point & middleware bindings
├── package.json         # Project dependencies & metadata
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore definitions
├── database.sqlite      # Local SQLite database file
├── config/              # Configuration files (DB & Passport strategies)
├── controllers/         # Request handlers for auth and admin logic
├── middlewares/         # JWT authentication & RBAC authorization guards
├── models/              # SQLite data abstraction models (User)
├── routes/              # Express endpoint routers
├── utils/               # JWT helpers and input validation rules
├── views/               # HTML layout files (Login, Register, Dashboard, Admin)
└── public/              # Static frontend assets (CSS styles & client-side JS)

```

---

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system.

### Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/secure-auth.git
cd secure-auth

```


2. Install dependencies:

```bash
npm install

```


3. Configure your environment variables:
Duplicate `.env.example` as `.env` and fill out your configuration parameters:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
SESSION_SECRET=your_session_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

```


4. Start the application:
```bash
npm start

```


5. Open your browser and navigate to `http://localhost:3000` (the root route automatically forwards to the login interface).

---

## Usage & Testing Flows

1. **Admin Verification:** Register your very first account. It will automatically be granted the `admin` role, unlocking the Admin Panel view.
2. **User Verification:** Log out and register a separate account. This user will receive standard `user` permissions and will be blocked with a 403 status if attempting to access admin endpoints.
3. **Theme Customization:** Click the Theme button on any page header to instantly toggle between light and dark glassmorphic layouts.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.