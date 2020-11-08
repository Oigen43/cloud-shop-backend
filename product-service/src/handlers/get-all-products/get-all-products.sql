SELECT p.id, description, title, price, count
FROM products p
INNER JOIN stocks s ON s.product_id = p.id