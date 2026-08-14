# AquaHub - React Frontend

AquaHub is a modern React SPA tailored for fish keepers and aquarists. It features interactive discussions, custom category filtering (Freshwater, Saltwater, Aquascaping), real-time post bookmarking, user follow/unfollow interactions, custom profile management, and light/dark theme support.

- **Backend Repository:** [AquaHub Backend](https://github.com/yairhtet1000/Aqua-Hub-Backend.git)

---

## Prerequisites & Requirements

- **Node.js:** `^18.x` or `^20.x`
- **NPM:** `^9.x` or higher
- **Backend API Server:** Ensure the Laravel backend server is running at `http://127.0.0.1:8000`.

---

## Installation & Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yairhtet1000/Aqua-Hub-Frontend.git
   cd Aqua-Hub-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the project root:
     ```env
     VITE_API_BASE_URL=http://127.0.0.1:8000/api
     ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

   The frontend app will launch at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```
