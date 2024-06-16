<?php
// function to search products by name
function searchProducts($query) {
    // Read products from JSON file
    $productsData = file_get_contents('../data/products.json');
    $products = json_decode($productsData, true);
    // array for found products
    $foundProducts = [];
    // iterate through every product to find overlapping names
    foreach ($products as $product) {
        // check if the product has the given query string in its name
        if (stripos($product['name'], $query) !== false) {
            $foundProducts[] = $product; //add the product to the array
        }
    }
    // Return found products as json
    return json_encode($foundProducts);
}
// Check if search query is provided
if (isset($_GET['query'])) {
    $query = $_GET['query'];
    // Perform search and echo results
    echo searchProducts($query);
}
?>
