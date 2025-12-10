class OrderDAO {
    async createOrder(client, userId, totalAmount) {
        const query = `
            INSERT INTO orders (user_id, total_amount, status) 
            VALUES ($1, $2, 'COMPLETED') 
            RETURNING id, status
        `;
        const result = await client.query(query, [userId, totalAmount]);
        return result.rows[0];
    }
}

module.exports = new OrderDAO();