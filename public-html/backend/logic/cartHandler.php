<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $method = $_POST['method'];

    if ($method === 'saveCart') {
        $cart = json_decode($_POST['cart'], true);
        $_SESSION['cart'] = $cart;
        echo json_encode(['status' => 'success']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $method = $_GET['method'];

    if ($method === 'loadCart') {
        if (isset($_SESSION['cart'])) {
            echo json_encode($_SESSION['cart']);
        } else {
            echo json_encode([]);
        }
    }
}
?>
