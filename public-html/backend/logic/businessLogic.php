<?php
include('../config/dataHandler.php');
include('accountLogic.php');
include('productLogic.php');
include('orderLogic.php');
class businessLogic
{
    // Initialsieren der Logic-Klassen
    // und des zentralen Data-Handlers
    private $productLogic;
    private $accountLogic;
    private $orderLogic;
    function __construct()
    {
        $dh = new dataHandler();
        $this->productLogic = new productLogic($dh);
        $this->accountLogic = new accountLogic($dh);
        $this->orderLogic = new orderLogic($dh);
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
            case 'getReceiptByUser':
                $res = $this->orderLogic->getReceiptByUser($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}