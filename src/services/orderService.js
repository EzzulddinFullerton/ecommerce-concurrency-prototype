const pool = require('../config/db');
const productDAO = require('../daos/productDAO');
const orderDAO = require('../daos/orderDAO');

class OrderService {
    async checkout(userId, productId) {
        const client = await pool.connect(); // Get connection from pool
        
        try {
            // Start Transaction (ACID Compliance)
            await client.query('BEGIN');

            // 1. Get Product with Row-Level Lock
            // This prevents race conditions if two users click buy simultaneously
            const product = await productDAO.getProductAndLock(client, productId);

            if (!product) {
                throw new Error('Product not found');
            }

            // 2. Business Rule: Check Inventory
            if (product.stock_quantity < 1) {
                throw new Error('Item out of stock');
            }

            // 3. Update Inventory
            const newStock = product.stock_quantity - 1;
            await productDAO.updateStock(client, productId, newStock);

            // 4. Simulate Payment Processing (External Integration)
            // In a real app, this would call the PaymentProcessor Adapter
            console.log(`Processing payment of $${product.price} for User ${userId}...`);

            // 5. Create Order Record
            const order = await orderDAO.createOrder(client, userId, product.price);

            // Commit Transaction
            await client.query('COMMIT');
            return order;

        } catch (error) {
            // Rollback on failure (Atomicity)
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new OrderService();