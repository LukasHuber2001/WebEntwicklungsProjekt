<?php
include('../config/dataHandler.php');
include('accountLogic.php');
include('productLogic.php');
include('orderLogic.php');
include('adminLogic.php');
class businessLogic
{
    // Initialsieren der Logic-Klassen
    // und des zentralen Data-Handlers
    private $productLogic;
    private $accountLogic;
    private $orderLogic;
    private $adminLogic;
    function __construct()
    {
        $dh = new dataHandler();
        $this->productLogic = new productLogic($dh);
        $this->accountLogic = new accountLogic($dh);
        $this->orderLogic = new orderLogic($dh);
        $this->adminLogic = new adminLogic($dh);
        session_start();
    }

    // Methode die abhängig von angegebener Methode und Paramter
    // spezifische Logik ausführt
    function handleRequest($method, $param)
    {
        $res = array();
        switch ($method) {
            case 'getSessionInfo':
                $res = $this->accountLogic->getSessionInfo();
                break;
            case 'registerUser':
                $res = $this->accountLogic->registerUser($param);
                break;
            case "loginUser":
                $res = $this->accountLogic->loginUser($param);
                break;
            case 'getProfileData';
                $res = $this->accountLogic->getProfileData($param);
                break;
            case 'updateUserData';
                $res = $this->accountLogic->updateUserData($param);
                break;
            case 'logoutUser':
                $res = $this->accountLogic->logoutUser();
                break;
            case 'loadAllProducts':
                $res = $this->productLogic->loadAllProducts();
                break;
            case 'searchProducts':
                $res = $this->productLogic->searchProducts($param);
                break;
            case 'loadProductByID':
                $res = $this->productLogic->loadProductByID($param);
                break;
            case 'getOrders':
                $res = $this->orderLogic->getOrders($param);
                break;
            case 'processOrder':
                $res = $this->orderLogic->processOrder($param);
                break;
            case 'getReceipt':
                $res = $this->orderLogic->getReceipt($param);
                break;
            case 'loadAllUsers':
                $res = $this->adminLogic->loadAllUsers();
                break;
            case 'loadUserByID':
                $res = $this->adminLogic->loadUserByID($param);
                break;
            case 'activateUser':
                $res = $this->adminLogic->activateUser($param);
                break;
            case 'deactivateUser':
                $res = $this->adminLogic->deactivateUser($param);
                break;
            case 'loadOrdersByUserID':
                $res = $this->adminLogic->loadOrdersByUserID($param);
                break;
            case 'loadOrderByID':
                $res = $this->adminLogic->loadOrderByID($param);
                break;
            case 'changeOrderLine':
                $res = $this->adminLogic->changeOrderLine($param);
                break;
            case 'createProduct':
                $res = $this->adminLogic->createProduct();
                break;
            case 'updateProduct':
                $res = $this->adminLogic->updateProduct();
                break;
            case 'deleteProduct':
                $res = $this->adminLogic->deleteProduct($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}