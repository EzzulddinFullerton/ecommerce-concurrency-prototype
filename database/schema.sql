-- Schema creation for Agile Commerce
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data: Creating a "High Demand" scenario (Only 1 item left)
INSERT INTO products (name, price, stock_quantity) VALUES 
('Limited Edition Sneaker', 150.00, 1), 
('Standard T-Shirt', 25.00, 100);