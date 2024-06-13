<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost", "root", '', "test");
mysqli_set_charset($mysqli, "utf8");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Assuming you get the order ID from the query parameter
$orderID = isset($_GET['orderID']) ? intval($_GET['orderID']) : 0;

if ($orderID > 0) {
    // Fetch order details
    $orderQuery = "SELECT o.invoiceNumber, c.name as buyerName, c.street as buyerStreet, c.city as buyerCity
                   FROM orders o
                   JOIN customers c ON o.customerID = c.id
                   WHERE o.id = $orderID";
    $orderResult = $mysqli->query($orderQuery);

    // Fetch products
    $productsQuery = "SELECT p.name, op.price, op.quantity
                      FROM order_products op
                      JOIN products p ON op.productID = p.id
                      WHERE op.orderID = $orderID";
    $productsResult = $mysqli->query($productsQuery);

    if ($orderResult->num_rows > 0 && $productsResult->num_rows > 0) {
        $orderDetails = $orderResult->fetch_assoc();
        $products = [];

        while ($row = $productsResult->fetch_assoc()) {
            $products[] = $row;
        }

        // Prepare the response
        $response = [
            'invoiceNumber' => $orderDetails['invoiceNumber'],
            'buyerAddress' => "{$orderDetails['buyerName']}\n{$orderDetails['buyerStreet']}\n{$orderDetails['buyerCity']}",
            'products' => $products
        ];

        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'No order found']);
    }
} else {
    echo json_encode(['error' => 'Invalid order ID']);
}

$mysqli->close();
?>
