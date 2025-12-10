const orderService = require('../services/orderService');

exports.checkout = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Input Validation
        if (!userId || !productId) {
            return res.status(400).json({ error: 'Missing userId or productId' });
        }

        // Delegate to Service Layer
        const order = await orderService.checkout(userId, productId);

        // Render View/Response
        res.status(201).json({
            message: 'Order processed successfully',
            orderId: order.id,
            status: order.status
        });

    } catch (error) {
        console.error("Checkout failed:", error.message);
        
        if (error.message === 'Item out of stock') {
            return res.status(409).json({ error: 'Item out of stock' });
        }
        
        res.status(500).json({ error: 'Internal Server Error' });
    }
};