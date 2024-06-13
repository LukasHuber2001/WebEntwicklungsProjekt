<?php
session_start();
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost", "root", '', "test");
mysqli_set_charset($mysqli, "utf8");

if(isset($_GET['login'])) {
    $email = $_POST['loginEmail'];
    $passwort = $_POST['loginPassword'];
    
    
    $sql = $mysqli->prepare("SELECT * FROM tbl_userinfo WHERE email = '$loginEmail' AND password='$password' LIMIT 1");
    $res
        
    //Überprüfung des Passworts
    if ($user !== false && password_verify($passwort, $user['password'])) {
        $_SESSION['userid'] = $user['id'];
        die('Login erfolgreich. Weiter zu <a href="geheim.php">internen Bereich</a>');
    } else {
        $errorMessage = "E-Mail oder Passwort war ungültig<br>";
    }
    
}