SELECT products.id, products.description, products.title, products.price, stocks.count
FROM products, stocks
WHERE products.id = stocks.product_id AND products.id = $1