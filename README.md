# First-Time Home Buyer Calculator

## App Summary
This web app helps first-time home buyers quickly estimate monthly home costs and understand tradeoffs like loan terms and down payment size. The primary user is a first-time buyer who wants simple, honest guidance without needing a spreadsheet. The product presents key inputs (home price, income, down payment, rate, term) and displays an estimated monthly payment breakdown. It also compares loan terms to help users understand total interest and monthly affordability. Our current milestone focuses on setting up the project repo and frontend scaffold, then building the backend + database vertical slice in upcoming milestones.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** (Team will implement — e.g., Node.js + Express)
- **Database:** (Team will implement — e.g., PostgreSQL)
- **Authentication:** (Optional / TBD)
- **External APIs/Services:** (Optional / TBD)

## Architecture Diagram
User → Browser (Frontend) → Backend Server → Database  
(Optional) Backend → External APIs

## Prerequisites
- Git
- (Backend TBD) Node.js
- (Database TBD) PostgreSQL + psql in PATH

## Installation and Setup
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd <repo-folder>

## Database Setup
The project includes SQL scripts in the /db folder that allow anyone to create a local PostgreSQL database for testing.
db/
  schema.sql
  seed.sql
  
## Prerequisites
- PostgreSQL installed
- psql available in your PATH

## Verify installation:
psql --version

## Step 1: Create the Database
createdb homebuyer_db
Or inside psql:
CREATE DATABASE homebuyer_db;

## Step 2: Run the Schema Script
From the project root:
psql -d homebuyer_db -f db/schema.sql
This creates all tables and relationships defined in the ERD.

## Step 3: Seed Sample Data
psql -d homebuyer_db -f db/seed.sql
This inserts sample users, scenarios, mortgage details, results, and tips for testing.
Verify Tables
psql -d homebuyer_db
Then run:
\dt
SELECT * FROM scenario;
The database is now ready for backend integration and local testing.
