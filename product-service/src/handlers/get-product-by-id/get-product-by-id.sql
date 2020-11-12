SELECT products.id, products.description, products.title, products.price, stocks.count
FROM products, stocks
WHERE products.id = stocks.product_id AND product.id = $1