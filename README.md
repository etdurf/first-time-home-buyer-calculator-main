# Home Calculator Application

## App Summary

The Home Calculator is a web application designed to help prospective homebuyers make informed purchasing decisions. The app provides tools to calculate mortgage payments, assess home affordability, compare loan options, and access helpful buyer tips. Whether you're a first-time homebuyer or looking to refinance, this application simplifies the complex calculations involved in home purchasing and helps users understand the long-term financial implications of their decisions.

**Primary Users:** First-time homebuyers, real estate shoppers, and individuals considering home purchases
**Key Features:** Mortgage calculations, affordability assessments, loan comparisons, buyer tips, and long-term cost analysis

---

## Tech Stack

### Frontend

- **Framework:** Next.js 16.1.6 (React 19)
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** Radix UI + shadcn/ui
- **Form Handling:** React Hook Form + Zod validation
- **Theme Management:** next-themes
- **Icons:** Lucide React

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **API Type:** RESTful JSON API
- **Port:** 3001

### Database

- **System:** PostgreSQL
- **Database Name:** `homebuyer`
- **Tables:** 6 (users, properties, mortgages, home_assessments, buyer_tips, mortgage_settings with indexes)
- **Connection:** Node.js `pg` package with connection pooling

### Development Tools

- **Package Manager:** npm (frontend), npm (backend)
- **Environment Variables:** dotenv
- **CORS:** Enabled for cross-origin requests

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Frontend (Next.js + React)                   │   │
│  │  - Mortgage Calculator                               │   │
│  │  - Affordability Assessment                          │   │
│  │  - Loan Comparison                                   │   │
│  │  - Buyer Tips Display                                │   │
│  │  Port: 3000                                          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/JSON
                       │ CORS Enabled
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Backend Server (Express.js)                 │
│              Port: 3001                                  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  API Endpoints:                                    │  │
│  │  - GET /api/users                                  │  │
│  │  - GET /api/users/:id                              │  │
│  │  - GET /api/users/:id/mortgage-settings            │  │
│  │  - POST /api/users/:id/mortgage-settings           │  │
│  │  - GET /api/users/:id/properties                   │  │
│  │  - GET /api/health                                 │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │ TCP/IP
                       │ Port: 5432
                       ▼
┌──────────────────────────────────────────────────────────┐
│           PostgreSQL Database (homebuyer)                │
│                                                          │
│  Tables:                                                 │
│  - users (User profiles)                                 │
│  - properties (Home properties for sale)                 │
│  - mortgages (Mortgage details)                          │
│  - home_assessments (Affordability assessments)          │
│  - buyer_tips (Tips and advice for homebuyers)           │
│  - mortgage_settings (User loan term and mortgage prefs) │
└──────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before running this project, ensure you have the following installed:

### 1. Node.js (v18 or higher)

- **Download:** https://nodejs.org/
- **Verify installation:**
  ```bash
  node --version
  npm --version
  ```

### 2. PostgreSQL (v12 or higher)

- **Download:** https://www.postgresql.org/download/
- **Verify installation:**
  ```bash
  psql --version
  ```

### 3. Git

- **Download:** https://git-scm.com/
- **Verify installation:**
  ```bash
  git --version
  ```

---

## Installation and Setup

### Step 1: Navigate to the Project

```bash
cd first-time-home-buyer-calculator-main
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
```

### Step 3: Backend Setup

```bash
cd ../backend
npm install
```

### Step 4: Database Setup

1. **Navigate back to the project root:**

   ```bash
   cd ..
   ```

2. **Create a PostgreSQL database named `homebuyer`:**

   ```bash
   psql -U postgres -c "CREATE DATABASE homebuyer;"
   ```

3. **Run the database schema to create tables:**

   ```bash
   psql -U postgres -d homebuyer -f db/schema.sql
   ```

4. **Populate the database with sample data:**

   ```bash
   psql -U postgres -d homebuyer -f db/seed.sql
   ```

5. **Verify the database was created successfully:**
   ```bash
   psql -U postgres -d homebuyer -c "SELECT * FROM users;"
   ```

### Step 5: Environment Configuration

1. **The backend `.env` file is already configured for local development:**
   - Check `backend/.env` with your database credentials
   - Default values (if using local PostgreSQL):

   ```
   DB_USER=postgres
   DB_PASSWORD=admin
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=homebuyer
   DATABASE_URL=postgresql://postgres:admin@localhost:5432/homebuyer
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

   - If your PostgreSQL password is different, update `DB_PASSWORD` and `DATABASE_URL`

2. **Optional: Create a `.env.local` file in the root directory:**
   ```bash
   # Root directory .env.local (if needed for frontend)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

---

## Running the Application

### Terminal 1: Start the Backend Server

```bash
cd backend
npm run dev
# or for production: npm start
```

You should see: `Server is running on http://localhost:3001`

### Terminal 2: Start the Frontend Application

```bash
cd frontend
npm run dev
```

You should see: `- Local: http://localhost:3000`

### Access the Application

Open your browser and navigate to: **http://localhost:3000**

---

## Verifying the Vertical Slice

Follow these steps to test that the **loan term persistence** feature works end-to-end:

### 1. Access the Application

- Navigate to http://localhost:3000
- Click the menu icon (≡) to view the navigation
- Click **"Mortgage Details"** (or wait for it to auto-navigate)
- Find the **Loan Term** section (has buttons for 15, 20, 30 years)

### 2. Trigger the Feature (Select a Loan Term)

- Click on **15 years** or **20 years** (or try different options)
- Open the **browser console** (F12 → Console tab)
- You should see messages:
  ```
  ✓ Loan term saved to database
  ✓ Settings auto-saved
  ```
- The button should highlight to show the selected term

### 3. Confirm Database Was Updated

```bash
# In a new terminal, connect to the database:
psql -U postgres -d homebuyer

# Run this query to verify the loan term was saved:
SELECT user_id, loan_term, home_price, down_payment_percent, interest_rate, updated_at
FROM mortgage_settings
WHERE user_id = 1;

# Expected output: Should show user_id=1 with your selected loan_term (15, 20, or 30)
# and the current timestamp in updated_at

# Exit psql:
\q
```

### 4. Verify Persistence (Refresh the Page)

- Refresh your browser (Cmd+R or Ctrl+R or F5)
- Check the **browser console** again
- You should see:
  ```
  📥 Loaded mortgage settings: {loan_term: 15, ...}
  ✓ Restoring loan term: 15 years (or whatever you selected)
  ```
- **Expected Result:** The same loan term button is still highlighted after refresh
- This confirms the change was saved to the database and persists across page reloads

### 5. Additional Verification (Optional)

- Try adjusting the sliders (Home Price, Annual Income, etc.)
- Wait 1 second after stopping (auto-save delay)
- Check console for `✓ Settings auto-saved`
- Refresh the page and verify those values are also restored
- Check the browser's Network tab in Developer Tools (F12)
- You should see:
  - **POST request** to `/api/users/1/mortgage-settings` when you select a term or adjust sliders
  - **GET request** to `/api/users/1/mortgage-settings` when the page loads

**End-to-End Flow:**

```
Click Loan Term Button → Frontend calls saveLoanTerm() →
POST to /api/users/1/mortgage-settings → Express server updates PostgreSQL →
Database row updated → Response sent back → Console shows "✓ Loan term saved" →
Page refreshes → GET /api/users/1/mortgage-settings →
Server queries database → Returns saved settings →
Frontend restores UI state → Loan term button highlights →
Change persists ✅
```

---

## Debugging Tips

### Backend won't start?

- Check if port 3001 is already in use: `lsof -i :3001`
- Verify PostgreSQL is running
- Check `.env` file credentials are correct

### Database connection errors?

- Verify PostgreSQL is running: `pg_isready -h localhost`
- Check credentials in `backend/.env`
- Ensure database `homebuyer` exists: `psql -l | grep homebuyer`

### Frontend showing errors?

- Clear Next.js cache: `rm -rf frontend/.next`
- Reinstall dependencies: `rm -rf frontend/node_modules && npm install --legacy-peer-deps`
- Check that backend is running on port 3001

---

## Project Structure

```
first-time-home-buyer-calculator-main/
├── frontend/                      # Next.js React application (Port 3000)
│   ├── app/                       # App directory (routing)
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── components/                # React components
│   │   ├── affordability-assessment.tsx
│   │   ├── buyer-tips.tsx
│   │   ├── loan-comparison.tsx
│   │   ├── long-term-cost.tsx
│   │   ├── mortgage-details.tsx
│   │   ├── payment-breakdown.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                       # Utility functions
│   │   ├── mortgage-context.tsx   # Mortgage context provider
│   │   └── utils.ts
│   ├── public/                    # Static assets
│   ├── styles/                    # Stylesheet files
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── postcss.config.mjs
│
├── backend/                       # Express.js server (Port 3001)
│   ├── server.js                  # Main server file with API endpoints
│   ├── db.js                      # PostgreSQL connection pool
│   ├── package.json
│   ├── .env                       # Environment variables (LOCAL ONLY)
│   ├── .env.example               # Example env template
│   └── .gitignore
│
├── db/                            # Database scripts
│   ├── schema.sql                 # Database schema (6 tables)
│   └── seed.sql                   # Sample data for testing
│
├── .gitignore
├── .env.example                   # Root environment template
└── README.md                      # This file
```

### Key Folders Explained

| Folder                 | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `frontend/`            | React/Next.js UI running on port 3000     |
| `backend/`             | Express API server running on port 3001   |
| `db/`                  | PostgreSQL schema and seed data           |
| `frontend/components/` | Reusable React components with UI widgets |
| `frontend/app/`        | Next.js app router pages                  |
| `frontend/lib/`        | Context providers and utility functions   |

---

## Next Steps

- [ ] Implement authentication (register/login)
- [ ] Add more interactive features with database updates
- [ ] Deploy to production (Vercel for frontend, Heroku/Railway for backend)
- [ ] Add tests (unit, integration, e2e)
- [ ] Implement error handling and logging
- [ ] Add input validation on backend
- [ ] Create additional API endpoints as needed

---
