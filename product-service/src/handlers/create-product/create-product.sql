WITH insertion AS (
    INSERT INTO products(description, title, price) VALUES($1, $2, $3) RETURNING id
) INSERT INTO stocks(product_id, count) (SELECT insertion.id, $4 AS count FROM insertion)
RETURNING product_id