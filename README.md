# Smart Contact Keeper (MERN Stack)

A secure, premium, and fully responsive MERN application to manage, search, and categorize your personal and professional connections. Features security user-isolation, dashboard overview statistics, contact filtering, favorite shortlisting, and light/dark theme toggles.

---

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios + Context API + Lucide Icons
- **Backend:** Node.js + Express.js + Mongoose
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs password hashing
- **Validation:** express-validator (backend checks)

---

## Folder Structure

```text
contact-keeper/
│
├── client/              # React frontend (Vite scaffolded)
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Navbar, PrivateRoute, ContactForm, ContactCard
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── pages/       # Home, Dashboard, Contacts, Forms, Profile
│   │   ├── App.jsx      # Router & context wrapper
│   │   └── main.jsx     # App initializer
│   └── .env             # VITE_API_URL=http://localhost:5000/api
│
├── server/              # Express backend
│   ├── config/          # Database connector
│   ├── controllers/     # Auth & Contacts controllers
│   ├── middleware/      # JWT Protection filter
│   ├── models/          # User & Contact schemas
│   ├── routes/          # API route definitions
│   └── server.js        # Main entrypoint
│
└── package.json         # Workspace execution manager
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0.0 or higher)
- A **MongoDB Atlas** account and database cluster.

### Setup Instructions

1. **Clone or Open the Project** in your workspace directory.
2. **Configure Backend Environment Variables**:
   Create a `.env` file in the `server` directory (template provided in `server/.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/contact_keeper?retryWrites=true&w=majority
   JWT_SECRET=your_custom_jwt_secret_key_here
   ```
3. **Configure Frontend Environment Variables**:
   Create a `.env` file in the `client` directory (template provided in `client/.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Installation

From the root workspace folder, run the following command to automatically install all dependencies across the workspace:

```bash
npm run install-all
```

Alternatively, you can install dependencies in each directory individually:
```bash
# In the root folder
npm install

# In the server folder
cd server && npm install

# In the client folder
cd client && npm install
```

---

## Running the Application

You can spin up both the React client and the Express backend simultaneously using the root-level workspace script:

```bash
npm run dev
```

This runs:
- Backend Server on [http://localhost:5000](http://localhost:5000)
- Frontend Client on [http://localhost:5173](http://localhost:5173)

---

## API Routes Summary

### Authentication (Public & Private)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Registers a new account; returns JWT token. |
| **POST** | `/api/auth/login` | Public | Authenticates credentials; returns JWT token. |
| **PUT** | `/api/auth/change-password` | Private | Changes current password (JWT required). |

### Contacts Management (Private / User-Scoped)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/contacts` | Private | Retrieves contacts for the logged-in user. Supports query parameters: `?search=<term>&category=<Family/Friends/Work/College/Others>&favorite=<true/false>` |
| **POST** | `/api/contacts` | Private | Creates a new contact record. |
| **GET** | `/api/contacts/:id` | Private | Retrieves details of a specific contact. |
| **PUT** | `/api/contacts/:id` | Private | Updates fields of a specific contact. |
| **DELETE** | `/api/contacts/:id` | Private | Permanently deletes a specific contact. |

### Dashboard Aggregate Stats
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/dashboard/stats` | Private | Aggregates counts: Total, Favorites, and counts by category. |

---

## Main UI Pages

1. **Home Page**: Informative guest landing page with a call to action.
2. **Register & Login Pages**: Modern glassmorphic forms with robust input verification.
3. **Dashboard Page**: Quick overview statistics (total contacts, favorites count, category grids) and lists of recent/favorite contacts.
4. **Contacts Directory**: Filterable search console with category and favorite selectors.
5. **Add / Edit Pages**: Clean form layouts with validation checks and quick favorite star buttons.
6. **Profile Page**: Displays user details and a form to change password settings.

---

## Production & Deployment

The application is optimized for single-service deployment (e.g. on Render, Heroku, or Railway) by serving the frontend React assets statically directly from the Express server.

### Scripts
* **Build**: `npm run build` — Installs workspace-wide dependencies and compiles the React application to `client/dist`.
* **Start**: `npm start` — Boots up the Node.js production server.

### Required Environment Variables
* `NODE_ENV`: `production`
* `MONGO_URI`: Your MongoDB Atlas Connection URI
* `JWT_SECRET`: Your secret key for generating JSON Web Tokens

