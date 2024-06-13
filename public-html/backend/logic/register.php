<?php
session_start();
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$mysqli = new mysqli("localhost", "root", '', "test");
mysqli_set_charset($mysqli, "utf8");

if(isset($_POST)) {
    $error = false;
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password2 = $_POST['password2'];
    $username = $_POST['username'];

    if(strlen($username) == 0) {
        echo 'Bitte einen Username angeben<br>';
        $error = true;
    }
    //Überprüfen, dass ein passwort gesetzt wurde
    if(strlen($password) == 0) {
        echo 'Bitte ein Passwort angeben<br>';
        $error = true;
    }
    //Überprüfen, dass beide Passwörter ident sind
    if($password != $password2) {
        echo 'Die Passwörter müssen übereinstimmen<br>';
        $error = true;
    }
    // Überpüfen ob die Email das richtige Format hat
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = true;
        echo 'Falsches email Format<br>';
    }
    //Überprüfe, dass die E-Mail-Adresse noch nicht registriert wurde
    if(!$error) { 
        $stmt = $mysqli-> prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($mysqli->affected_rows != 0) {
            echo 'Die Emailadresse ist bereits vergeben<br>';
            $error = true;
        }
    }
    if(!$error) {    
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Prepared statement, stage 1: prepare 
        $statement = $mysqli->prepare("INSERT INTO users(id, vorname, nachname, adresse, adresse2, ort, plz, land, username, password, isAdmin, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        // Prepared statement, stage 2: bind and execute 
        $id = NULL;
        $vorname = $_POST['vorname'];
        $nachname = $_POST['nachname'];
        $adresse = $_POST['adresse'];
        $adresse2 = $_POST['adresse2'];
        $ort = $_POST['ort'];
        $plz = $_POST['plz'];
        $land = $_POST['land'];
        $username = $_POST['username']; 
        $isAdmin = NULL;
        
        $statement->bind_param('ssssssssssss', $id, $vorname, $nachname, $adresse, $adresse2, $ort, $plz, $land, $username, $password_hash, $isAdmin, $email); // "s" means that $id is bound as an integer and $label as a string

        $statement->execute();

        $filename = "../data/users.json";
        $sel = "SELECT * FROM users";
        $result = $mysqli->query($sel);
        if($result->num_rows>0){
            
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            $rowsAsJSON = json_encode($rows);
            file_put_contents("../data/users.json", $rowsAsJSON);
        }   
        header("Location: http://localhost/webentwicklungsprojekt/public-html/frontend/sites/index.html");
        die();
}
}
