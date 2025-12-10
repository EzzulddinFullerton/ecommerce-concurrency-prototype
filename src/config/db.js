const { Pool } = require('pg');

// Create a new pool instance with configuration
// Using environment variables allows for secure deployment as mentioned in Phase 3
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'agile_commerce',
    password: process.env.DB_PASSWORD || 'your_secure_password',
    port: process.env.DB_PORT || 5432,
    
    // Pool Optimization settings (Optional but recommended for high concurrency)
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error if connection takes too long
});

// Event listener for unexpected errors on idle clients
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;