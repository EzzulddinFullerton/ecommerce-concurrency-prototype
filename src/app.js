const express = require('express');
const bodyParser = require('body-parser');
const orderController = require('./controllers/orderController');

const app = express();
app.use(bodyParser.json());

// Route definition
app.post('/api/checkout', orderController.checkout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Agile Commerce API running on port ${PORT}`);
});