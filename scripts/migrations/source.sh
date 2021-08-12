#!/usr/bin/sh

[ ! -e prod.products.csv ] && echo "select * from prod_products" | ssh infinitecloset 'sudo -u postgres psql -d infinite-closet-dev --csv'  >| prod.products.csv
echo 'INSERT INTO products (id, name, slug, "shortRentalPrice", "longRentalPrice", "retailPrice", "purchasePrice", details, "stylistNotes", designer) SELECT id, name, slug, short_rental_price AS "shortRentalPrice", long_rental_price AS "longRentalPrice", retail_price AS "retailPrice", purchase_price AS "purchasePrice", description AS details, stylist_notes AS "stylistNotes", designer FROM prod_products;'
    | ssh infinitecloset 'sudo -Hiu postgres psql -d infinite-closet-dev'
echo 'INSERT INTO designers (id, name, slug) SELECT id, name, slug FROM prod_designers;'
    | ssh infinitecloset 'sudo -Hiu postgres psql -d infinite-closet-dev'
echo 'UPDATE products SET designer = prod_products.designer FROM prod_products WHERE products.id = prod_products.id;'
    | ssh infinitecloset 'sudo -Hiu postgres psql -d infinite-closet-dev'
