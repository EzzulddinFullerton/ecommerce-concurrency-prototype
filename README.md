# Agile Commerce Prototype

A cloud-native e-commerce platform built using a strictly enforced **Layered (n-tier) Architecture** to prioritize **Scalability, Security, and Modifiability**.

This prototype validates the core architectural mechanism for handling high-concurrency inventory updates using PostgreSQL's transaction management and row-level locking.

## ⚙️ Architecture Validation

| View | Component | Mechanism Tested | Status |
| :--- | :--- | :--- | :--- |
| **Logical View** | 4-Tier Structure | Separation of Presentation, Service, and Data Access Layers. | ✅ Passed |
| **Process View** | Concurrency Scenario | **Row-Level Locking** (`FOR UPDATE`) to prevent race conditions during checkout. | ✅ Passed |
| **Use Case View** | Checkout & Payment | ACID properties of the database ensure transaction integrity. | ✅ Passed |

## 📦 Project Structure

The codebase is organized to mirror the Logical View of the design document:

```text
.
├── src/
│   ├── config/             # Connection Manager (db.js)
│   ├── controllers/        # Presentation Layer (API Controllers)
│   ├── services/           # Service Layer (Business Logic, Transactions)
│   └── daos/               # Data Access Layer (Persistence logic, SQL)
├── database/
│   └── schema.sql          # Database Schema and Seed Data
├── package.json
└── README.md
```

## 🚀 Build and Run Instructions

Follow these steps to set up the environment, deploy the prototype, and run the concurrency test.

### Prerequisites

1.  **Node.js** (v16+)
2.  **PostgreSQL** (v15+)
3.  `curl` command-line tool (or Postman/Insomnia for easier testing).

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/EzzulddinFullerton/Agile-Commerce-Prototype.git
cd agile-commerce-prototype

# Install Node dependencies (Express, pg)
npm install
```

### Step 2: Database Setup

The application requires a PostgreSQL database instance named `agile_commerce`.

1.  **Create the Database:**
    Open your PostgreSQL terminal (`psql`) and run:

    ```sql
    CREATE DATABASE agile_commerce;
    ```

2.  **Run Schema and Seed Data:**
    This script creates the `products` and `orders` tables and inserts one crucial item with a stock quantity of **1** to set up the race condition scenario.

    ```bash
    # Execute the schema.sql file against the new database
    psql -U postgres -d agile_commerce -f ./database/schema.sql
    ```

### Step 3: Start the Application Server

Start the Node.js application server:

```bash
node src/app.js
# Output: Agile Commerce API running on port 3000
```

## 🧪 Architectural Validation: Concurrency Test

This test directly validates the Scenario View: **Two users attempting to purchase the last item simultaneously**.

We use the Windows Command Prompt (`cmd.exe`) syntax with the `&` operator to launch two requests almost concurrently. The database's Row-Level Locking must ensure only one succeeds.

**Run this single command line:**

```bash
# User 1 and User 2 simultaneously attempt to buy Product ID 1 (Stock: 1)
curl -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d "{\"userId\": 1, \"productId\": 1}" & curl -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d "{\"userId\": 2, \"productId\": 1}"
```

### Expected Output

The system demonstrates the designed concurrency handling:

1.  **Winner (User 1 or 2):** Successful order commitment.
    ```json
    {"message":"Order processed successfully","orderId":1,"status":"COMPLETED"}
    ```
2.  **Loser (The other user):** Transaction rollback due to inventory being depleted under lock.
    ```json
    {"error":"Item out of stock"}
    ```

The separation of concerns is validated by the stack trace in the code: Controller calls Service, which initiates a database transaction, acquires a lock via DAO, checks the stock, and then commits or rolls back based on the outcome.
