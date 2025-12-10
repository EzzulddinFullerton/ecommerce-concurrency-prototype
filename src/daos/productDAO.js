const pool = require('../config/db');

class ProductDAO {
    // Retrieves product and locks the row for the transaction duration
    async getProductAndLock(client, productId) {
        const query = 'SELECT * FROM products WHERE id = $1 FOR UPDATE';
        const result = await client.query(query, [productId]);
        return result.rows[0];
    }

    async updateStock(client, productId, newQuantity) {
        const query = 'UPDATE products SET stock_quantity = $1 WHERE id = $2';
        await client.query(query, [newQuantity, productId]);
    }
}

module.exports = new ProductDAO();