# Ecommerce Concurrency Prototype

A focused Node.js + PostgreSQL prototype that demonstrates a clean **layered (n-tier) architecture** and **race-condition-safe inventory management** using PostgreSQL row-level locking (`SELECT ... FOR UPDATE`).

This project validates that two users trying to buy the last item of a product at the same time results in exactly one successful order and one clean “out of stock” failure — without overselling.

## Architecture

The codebase strictly follows a 4-layer design:

| Layer              | Responsibility                            | Location              |
|--------------------|-------------------------------------------|-----------------------|
| Presentation       | HTTP handling & input validation          | `src/controllers/`    |
| Service            | Business logic + transaction orchestration| `src/services/`       |
| Data Access (DAO)  | SQL queries & locking                     | `src/daos/`           |
| Infrastructure     | Connection pool                           | `src/config/db.js`    |

**Key concurrency mechanism:**
- The service starts a transaction
- The product row is locked with `FOR UPDATE`
- Stock is checked and decremented under the lock
- Order is created
- Transaction is committed or rolled back

This guarantees ACID properties and prevents the classic “last item sold twice” race condition.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: PostgreSQL 15+
- **Driver**: `pg` (with connection pooling)

## Project Structure

```
.
├── database/
│   └── schema.sql          # Tables + seed data (one limited item)
├── src/
│   ├── config/
│   │   └── db.js           # Connection pool
│   ├── controllers/
│   │   └── orderController.js
│   ├── daos/
│   │   ├── productDAO.js   # Contains the FOR UPDATE lock
│   │   └── orderDAO.js
│   ├── services/
│   │   └── orderService.js # Transaction orchestration
│   └── app.js
├── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL 15+

### 1. Install dependencies
```bash
git clone https://github.com/EzzulddinFullerton/ecommerce-concurrency-prototype.git
cd ecommerce-concurrency-prototype
npm install
```

### 2. Create and seed the database
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE agile_commerce;"

# Run schema + seed data
psql -U postgres -d agile_commerce -f ./database/schema.sql
```

The seed data creates a product with **stock = 1** specifically to demonstrate the race condition.

### 3. Configure (optional)
You can override defaults with environment variables:

```bash
export DB_USER=postgres
export DB_HOST=localhost
export DB_NAME=agile_commerce
export DB_PASSWORD=your_password
export DB_PORT=5432
```

### 4. Start the server
```bash
node src/app.js
# → Agile Commerce API running on port 3000
```

## Concurrency Test

Simulate two users trying to buy the last item at the same time:

**Linux / macOS / Git Bash:**
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":1}' & \
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":2,"productId":1}'
```

**Windows CMD:**
```cmd
curl -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d "{\"userId\":1,\"productId\":1}" & curl -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d "{\"userId\":2,\"productId\":1}"
```

### Expected Result
- One request succeeds → `{ "message": "Order processed successfully", "orderId": ..., "status": "COMPLETED" }`
- The other fails → `{ "error": "Item out of stock" }`

Only one order is created and stock never goes negative.

## API

| Method | Endpoint          | Body                                          | Description                |
|--------|-------------------|-----------------------------------------------|----------------------------|
| POST   | `/api/checkout`   | `{ "userId": number, "productId": number }`   | Attempt to purchase an item |

## What This Prototype Intentionally Focuses On

- Clean separation of concerns
- Correct transactional boundaries
- Real row-level locking under concurrent load
- Demonstrable race-condition prevention

It is **not** a full e-commerce platform (no auth, cart, payments, product catalog UI, etc.).

## License

ISC
