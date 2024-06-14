<?php
session_start();
include("../config/dataHandler");
$mysqli = new mysqli("localhost", "root", '', "test");

if(isset($_POST)){
    $email = $_POST['loginEmail'];
    $passwort = $_POST['loginPassword'];
    
    $response = array();
    $response["success"] = false; 

    $sql = $mysqli->prepare("SELECT * FROM users WHERE email = '$loginEmail' AND password='$password' LIMIT 1");
    $result = $statement->execute(array('email' => $loginEmail));
    $user = $statement->fetch();
    if($user !== false && password_verify($loginPasswort, $user['passwort'])) {
        $_SESSION['userid'] = $user['id'];
        
        //Möchte der Nutzer angemeldet beleiben?
        if(isset($_POST['angemeldet_bleiben'])) {
           $identifier = random_string();
           $securitytoken = random_string();
           
           $insert = $pdo->prepare("INSERT INTO securitytokens (user_id, identifier, securitytoken) VALUES (:user_id, :identifier, :securitytoken)");
           $insert->execute(array('user_id' => $user['id'], 'identifier' => $identifier, 'securitytoken' => sha1($securitytoken)));
           setcookie("identifier",$identifier,time()+(3600*24*365)); //1 Jahr Gültigkeit
           setcookie("securitytoken",$securitytoken,time()+(3600*24*365)); //1 Jahr Gültigkeit
        }
        die();
}
}